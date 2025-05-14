package com.ssafy.bookshy.domain.chat.dto;

import com.ssafy.bookshy.domain.chat.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 서버가 클라이언트에게 응답으로 보내는 메시지 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponseDto {
    private Long id;
    private Long chatRoomId;
    private Long senderId;
    private String senderNickname;
    private String content;
    private String type;
    private LocalDateTime sentAt;
    private boolean isRead;
    private List<String> emojis;

    public static ChatMessageResponseDto from(ChatMessage message, String senderNickname) {
        return ChatMessageResponseDto.builder()
                .id(message.getId())
                .chatRoomId(message.getChatRoom().getId())
                .senderId(message.getSenderId())
                .senderNickname(senderNickname)
                .content(message.getContent())
                .sentAt(message.getTimestamp())
                .type(message.getType())
                .isRead(message.isRead())
                .emojis(message.getEmojis())
                .build();
    }
}

