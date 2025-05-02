package com.ssafy.bookshy.domain.chat.service;

import com.ssafy.bookshy.domain.chat.dto.ChatMessageRequestDto;
import com.ssafy.bookshy.domain.chat.dto.ChatMessageResponseDto;
import com.ssafy.bookshy.domain.chat.entity.ChatMessage;
import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.chat.repository.ChatMessageRepository;
import com.ssafy.bookshy.domain.chat.repository.ChatRoomRepository;
import com.ssafy.bookshy.domain.users.service.UserService;
import com.ssafy.bookshy.kafka.dto.ChatMessageKafkaDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 채팅 메시지 관련 비즈니스 로직을 담당하는 서비스 클래스입니다.
 * - 메시지 저장, 조회
 * - Kafka를 통해 수신된 메시지 저장
 * - 메시지에 이모지 추가 등 기능을 제공합니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserService userService;

    /**
     * 지정된 채팅방의 모든 메시지를 시간 순으로 조회합니다.
     *
     * @param chatRoomId 조회할 채팅방 ID
     * @return ChatMessageResponseDto 리스트
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
     * 클라이언트가 보낸 메시지를 DB에 저장합니다.
     * - WebSocket을 통해 직접 받은 메시지를 처리
     *
     * @param request 클라이언트 요청 DTO
     * @return 저장된 메시지 정보 DTO
     */
    @Transactional
    public ChatMessageResponseDto saveMessage(ChatMessageRequestDto request) {
        ChatRoom chatRoom = chatRoomRepository.findById(request.getChatRoomId())
                .orElseThrow(() -> new IllegalArgumentException("채팅방이 존재하지 않습니다."));

        ChatMessage message = ChatMessage.builder()
                .chatRoom(chatRoom)
                .senderId(request.getSenderId())
                .content(request.getContent())
                .timestamp(LocalDateTime.now()) // 보낸 시간
                .build();

        ChatMessage saved = chatMessageRepository.save(message);

        // 채팅방의 마지막 메시지 내용/시간 갱신
        chatRoom.updateLastMessage(saved.getContent(), saved.getTimestamp());

        // 닉네임 조회 및 응답 DTO 변환
        String nickname = userService.getNicknameById(saved.getSenderId());
        return ChatMessageResponseDto.from(saved, nickname);
    }

    /**
     * Kafka에서 수신한 채팅 메시지를 DB에 저장합니다.
     * - 메시지를 직접 broadcast 하지 않고 Kafka를 통해 전달받는 구조
     *
     * @param dto Kafka로부터 수신된 메시지 DTO
     * @return 저장된 메시지 정보 DTO
     */
    @Transactional
    public ChatMessageResponseDto saveMessageFromKafka(ChatMessageKafkaDto dto) {
        ChatRoom chatRoom = chatRoomRepository.findById(dto.getChatRoomId())
                .orElseThrow(() -> new IllegalArgumentException("채팅방이 존재하지 않습니다."));

        ChatMessage message = ChatMessage.builder()
                .chatRoom(chatRoom)
                .senderId(dto.getSenderId())
                .content(dto.getContent())
                .timestamp(LocalDateTime.now()) // Kafka 메시지에는 timestamp가 없으므로 현재 시간 사용
                .build();

        ChatMessage saved = chatMessageRepository.save(message);

        // 채팅방의 마지막 메시지 내용/시간 갱신
        chatRoom.updateLastMessage(saved.getContent(), saved.getTimestamp());

        // 사용자 닉네임 조회 및 응답 DTO 반환
        String nickname = userService.getNicknameById(saved.getSenderId());
        return ChatMessageResponseDto.from(saved, nickname);
    }

    /**
     * 특정 메시지에 이모지를 추가합니다.
     *
     * @param messageId 메시지 ID
     * @param emoji     추가할 이모지 문자열
     */
    @Transactional
    public void addEmojiToMessage(Long messageId, String emoji) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("메시지를 찾을 수 없습니다."));
        message.addEmoji(emoji);
    }
}
