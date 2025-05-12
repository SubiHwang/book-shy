package com.ssafy.bookshy.domain.chat.service;

import com.ssafy.bookshy.domain.chat.dto.ChatMessageRequestDto;
import com.ssafy.bookshy.domain.chat.dto.ChatMessageResponseDto;
import com.ssafy.bookshy.domain.chat.dto.ReadReceiptPayload;
import com.ssafy.bookshy.domain.chat.entity.ChatMessage;
import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.chat.repository.ChatMessageRepository;
import com.ssafy.bookshy.domain.chat.repository.ChatRoomRepository;
import com.ssafy.bookshy.domain.users.service.UserService;
import com.ssafy.bookshy.kafka.dto.ChatMessageKafkaDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
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
                .orElseThrow(() -> new IllegalArgumentException("채팅방이 존재하지 않습니다."));

        ChatMessage message = ChatMessage.builder()
                .chatRoom(chatRoom)
                .senderId(userId)
                .content(request.getContent())
                .timestamp(LocalDateTime.now())
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
                .orElseThrow(() -> new IllegalArgumentException("채팅방이 존재하지 않습니다."));

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
     * 🧸 특정 메시지에 이모지를 추가
     *
     * - 메시지 존재 여부 확인
     * - 이모지 리스트에 추가
     *
     * @param messageId 메시지 ID
     * @param emoji 추가할 이모지
     */
    @Transactional
    public void addEmojiToMessage(Long messageId, String emoji) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("메시지를 찾을 수 없습니다."));
        message.addEmoji(emoji);
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
        List<ChatMessage> unreadMessages = chatMessageRepository.findUnreadMessages(chatRoomId, userId);
        if (unreadMessages.isEmpty()) return;

        unreadMessages.forEach(ChatMessage::markAsRead);

        List<Long> readMessageIds = unreadMessages.stream()
                .map(ChatMessage::getId)
                .collect(Collectors.toList());

        ReadReceiptPayload payload = new ReadReceiptPayload(readMessageIds, userId);

        messagingTemplate.convertAndSend("/topic/read/" + chatRoomId, payload);
    }
}
