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

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserService userService;

    public List<ChatMessageResponseDto> getMessages(Long chatRoomId) {
        List<ChatMessage> messages = chatMessageRepository.findAllByChatRoomIdOrderByTimestampAsc(chatRoomId);
        return messages.stream()
                .map(msg -> {
                    String nickname = userService.getNicknameById(msg.getSenderId());
                    return ChatMessageResponseDto.from(msg, nickname);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public ChatMessageResponseDto saveMessage(ChatMessageRequestDto request) {
        ChatRoom chatRoom = chatRoomRepository.findById(request.getChatRoomId())
                .orElseThrow(() -> new IllegalArgumentException("채팅방이 존재하지 않습니다."));

        ChatMessage message = ChatMessage.builder()
                .chatRoom(chatRoom)
                .senderId(request.getSenderId())
                .content(request.getContent())
                .timestamp(LocalDateTime.now())
                .build();

        ChatMessage saved = chatMessageRepository.save(message);
        chatRoom.updateLastMessage(saved.getContent(), saved.getTimestamp());

        String nickname = userService.getNicknameById(saved.getSenderId());
        return ChatMessageResponseDto.from(saved, nickname);
    }

    @Transactional
    public ChatMessageResponseDto saveMessageFromKafka(ChatMessageKafkaDto dto) {
        ChatRoom chatRoom = chatRoomRepository.findById(dto.getChatRoomId())
                .orElseThrow(() -> new IllegalArgumentException("채팅방이 존재하지 않습니다."));

        ChatMessage message = ChatMessage.builder()
                .chatRoom(chatRoom)
                .senderId(dto.getSenderId())
                .content(dto.getContent())
                .timestamp(LocalDateTime.now())
                .build();

        ChatMessage saved = chatMessageRepository.save(message);
        chatRoom.updateLastMessage(saved.getContent(), saved.getTimestamp());

        String nickname = userService.getNicknameById(saved.getSenderId());
        return ChatMessageResponseDto.from(saved, nickname);
    }

    @Transactional
    public void addEmojiToMessage(Long messageId, String emoji) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("메시지를 찾을 수 없습니다."));
        message.addEmoji(emoji);
    }
}
