package com.ssafy.bookshy.domain.chat.service;

import com.ssafy.bookshy.common.constants.ImageUrlConstants;
import com.ssafy.bookshy.common.file.FileUploadUtil;
import com.ssafy.bookshy.domain.chat.dto.ChatMessageRequestDto;
import com.ssafy.bookshy.domain.chat.dto.ChatMessageResponseDto;
import com.ssafy.bookshy.domain.chat.dto.EmojiUpdatePayload;
import com.ssafy.bookshy.domain.chat.dto.ReadReceiptPayload;
import com.ssafy.bookshy.domain.chat.entity.ChatMessage;
import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.chat.exception.ChatErrorCode;
import com.ssafy.bookshy.domain.chat.exception.ChatException;
import com.ssafy.bookshy.domain.chat.repository.ChatMessageRepository;
import com.ssafy.bookshy.domain.chat.repository.ChatRoomRepository;
import com.ssafy.bookshy.domain.users.service.UserService;
import com.ssafy.bookshy.kafka.dto.ChatMessageKafkaDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.io.FilenameUtils;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * 💬 채팅 메시지 비즈니스 로직 처리 서비스
 *
 * 주요 기능:
 * - 채팅 메시지 저장 (WebSocket, Kafka)
 * - 메시지 조회 (시간순)
 * - 읽음 처리
 * - 이모지 추가
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * 🕐 채팅방의 메시지 전체를 시간 순으로 조회
     *
     * @param chatRoomId 채팅방 ID
     * @return 채팅 메시지 DTO 리스트
     */
    public List<ChatMessageResponseDto> getMessages(Long chatRoomId) {
        List<ChatMessage> messages = chatMessageRepository.findAllByChatRoomIdOrderByTimestampAsc(chatRoomId);

        return messages.stream()
                .map(msg -> {
                    String nickname = userService.getNicknameById(msg.getSenderId());
                    return ChatMessageResponseDto.from(msg, nickname);
                })
                .collect(Collectors.toList());
    }

    /**
     * ✉️ 클라이언트가 WebSocket으로 보낸 메시지를 DB에 저장
     *
     * - 채팅방 존재 여부 확인
     * - ChatMessage 엔티티 생성 및 저장
     * - 채팅방의 마지막 메시지/시간 갱신
     * - 응답 DTO 반환
     *
     * @param request 클라이언트 요청 DTO
     * @return 저장된 메시지 응답 DTO
     */
    @Transactional
    public ChatMessageResponseDto saveMessage(ChatMessageRequestDto request, Long userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(request.getChatRoomId())
                .orElseThrow(() -> new ChatException(ChatErrorCode.CHATROOM_NOT_FOUND));

        ChatMessage message = ChatMessage.builder()
                .chatRoom(chatRoom)
                .senderId(userId)
                .content(request.getContent())
                .timestamp(LocalDateTime.now(ZoneId.of("Asia/Seoul")))
                .type(request.getType())
                .build();

        ChatMessage saved = chatMessageRepository.save(message);

        // 채팅방의 마지막 메시지 내용 및 시간 업데이트
        chatRoom.updateLastMessage(saved.getContent(), saved.getTimestamp());

        String nickname = userService.getNicknameById(saved.getSenderId());
        return ChatMessageResponseDto.from(saved, nickname);
    }

    /**
     * 📨 Kafka에서 수신한 메시지를 DB에 저장
     *
     * - 외부 서비스 또는 Kafka Consumer를 통해 들어온 메시지 처리
     * - 채팅방 존재 여부 확인
     * - 메시지 저장 및 채팅방 마지막 메시지 갱신
     * - 응답 DTO 반환
     *
     * @param dto Kafka DTO
     * @return 저장된 메시지 응답 DTO
     */
    @Transactional
    public ChatMessageResponseDto saveMessageFromKafka(ChatMessageKafkaDto dto) {
        ChatRoom chatRoom = chatRoomRepository.findById(dto.getChatRoomId())
                .orElseThrow(() -> new ChatException(ChatErrorCode.CHATROOM_NOT_FOUND));

        ChatMessage message = ChatMessage.builder()
                .chatRoom(chatRoom)
                .senderId(dto.getSenderId())
                .content(dto.getContent())
                .timestamp(LocalDateTime.now(ZoneId.of("Asia/Seoul"))) // Kafka 메시지에는 timestamp가 없을 수 있으므로 현재 시간
                .type(dto.getType())
                .build();

        ChatMessage saved = chatMessageRepository.save(message);
        chatRoom.updateLastMessage(saved.getContent(), saved.getTimestamp());

        String nickname = userService.getNicknameById(saved.getSenderId());
        return ChatMessageResponseDto.from(saved, nickname);
    }

    /**
     * 🧸 특정 메시지에 이모지를 추가 (덮어쓰기)
     *
     * - 메시지 존재 여부 확인
     *
     * @param messageId 메시지 ID
     * @param emoji 추가할 이모지
     */
    @Transactional
    public void addEmojiToMessage(Long messageId, String emoji) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new ChatException(ChatErrorCode.MESSAGE_NOT_FOUND));

        message.addEmoji(emoji);

        // WebSocket 발행
        EmojiUpdatePayload payload = new EmojiUpdatePayload(
                message.getId(),
                emoji,
                "ADD",
                message.getSenderId() // 또는 현재 유저 ID
        );
        messagingTemplate.convertAndSend("/topic/chat/emoji/" + message.getChatRoom().getId(), payload);
    }

    /**
     * 🧸 특정 메시지에 이모지를 삭제
     *
     * - 메시지 존재 여부 확인
     *
     * @param messageId 메시지 ID
     */
    @Transactional
    public void removeEmojiFromMessage(Long messageId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new ChatException(ChatErrorCode.MESSAGE_NOT_FOUND));

        message.removeEmoji();

        // WebSocket 발행
        EmojiUpdatePayload payload = new EmojiUpdatePayload(
                message.getId(),
                null,
                "REMOVE",
                message.getSenderId() // 또는 현재 유저 ID
        );
        messagingTemplate.convertAndSend("/topic/chat/emoji/" + message.getChatRoom().getId(), payload);
    }

    /**
     * ✅ 채팅방 내 읽지 않은 메시지들을 읽음 처리
     *
     * - senderId가 userId와 다른 메시지 중 isRead=false인 것만 필터링
     * - 각 메시지에 대해 `isRead = true` 설정
     *
     * @param chatRoomId 채팅방 ID
     * @param userId 읽은 사용자 ID
     */
    @Transactional
    public void markMessagesAsRead(Long chatRoomId, Long userId) {
        // 1️⃣ 채팅방 유효성 검사
        chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new ChatException(ChatErrorCode.CHATROOM_NOT_FOUND));

        // 2️⃣ 안 읽은 메시지 조회
        List<ChatMessage> unreadMessages = chatMessageRepository.findUnreadMessages(chatRoomId, userId);
        if (unreadMessages.isEmpty()) {
            log.debug("✅ 이미 모두 읽음 처리됨: roomId={}, userId={}", chatRoomId, userId);
            return;
        }

        // 3️⃣ 읽음 처리
        unreadMessages.forEach(ChatMessage::markAsRead);

        List<Long> readMessageIds = unreadMessages.stream()
                .map(ChatMessage::getId)
                .collect(Collectors.toList());

        // 4️⃣ WebSocket으로 읽음 전파
        ReadReceiptPayload payload = new ReadReceiptPayload(readMessageIds, userId);
        messagingTemplate.convertAndSend("/topic/read/" + chatRoomId, payload);
    }

    /**
     * 🖼️ 채팅 이미지 파일을 서버에 저장하고, 해당 채팅방에 WebSocket 메시지를 전송합니다.
     *
     * 1. MultipartFile을 로컬 디렉토리에 저장
     * 2. DB에 ChatMessage 엔티티 저장 (타입: IMAGE)
     * 3. SimpMessagingTemplate을 통해 채팅방 구독자에게 실시간 메시지 전송
     *
     * @param chatRoomId 채팅방 ID
     * @param senderId 보낸 사용자 ID
     * @param imageFile 업로드된 이미지 파일
     * @return 업로드된 이미지의 URL
     */
    @Transactional
    public String uploadChatImage(Long chatRoomId, Long senderId, MultipartFile imageFile) {
        if (imageFile == null || imageFile.isEmpty()) {
            throw new ChatException(ChatErrorCode.INVALID_IMAGE_TYPE);
        }

        try {
            // 1️⃣ 파일명 및 경로 설정
            String uuid = UUID.randomUUID().toString();
            String ext = FilenameUtils.getExtension(imageFile.getOriginalFilename());
            String fileName = uuid + "." + ext;
            String thumbFileName = uuid + "_thumb." + ext;

            String imageDir = "/home/ubuntu/bookshy/images/chat";
            String thumbDir = imageDir + "/thumb";

            String imageUrl = ImageUrlConstants.CHAT_IMAGE_BASE_URL + fileName;
            String thumbnailUrl = ImageUrlConstants.CHAT_IMAGE_BASE_URL + "thumb/" + thumbFileName;

            // 2️⃣ 원본 이미지 저장
            FileUploadUtil.saveFile(imageFile, imageDir, fileName);

            // 3️⃣ 썸네일 저장
            Path thumbPath = Paths.get(thumbDir);
            if (!Files.exists(thumbPath)) Files.createDirectories(thumbPath);

            Thumbnails.of(imageFile.getInputStream())
                    .size(240, 240)
                    .outputQuality(0.8)
                    .toFile(thumbPath.resolve(thumbFileName).toFile());

            // 4️⃣ 채팅방 유효성 확인
            ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                    .orElseThrow(() -> new ChatException(ChatErrorCode.CHATROOM_NOT_FOUND));

            // 5️⃣ 메시지 저장
            ChatMessage message = ChatMessage.builder()
                    .chatRoom(chatRoom)
                    .senderId(senderId)
                    .content(null)
                    .imageUrl(imageUrl)
                    .thumbnailUrl(thumbnailUrl) // ✅ 썸네일 포함
                    .type("IMAGE")
                    .timestamp(LocalDateTime.now(ZoneId.of("Asia/Seoul")))
                    .build();

            chatMessageRepository.save(message);

            // 6️⃣ 채팅방 최신 메시지 갱신
            chatRoom.updateLastMessage("[이미지]", message.getTimestamp());

            // 7️⃣ WebSocket 메시지 전송
            String nickname = userService.getNicknameById(senderId);
            ChatMessageResponseDto responseDto = ChatMessageResponseDto.from(message, nickname);

            messagingTemplate.convertAndSend("/topic/chat/" + chatRoomId, responseDto);

            return imageUrl;

        } catch (Exception e) {
            throw new ChatException(ChatErrorCode.IMAGE_UPLOAD_FAILED);
        }
    }

}
