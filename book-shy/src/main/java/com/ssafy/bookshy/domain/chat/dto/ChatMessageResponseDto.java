package com.ssafy.bookshy.domain.chat.dto;

import com.ssafy.bookshy.domain.chat.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 서버가 클라이언트에게 응답으로 보내는 메시지 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponseDto {
    private Long id;               // 메시지 ID
    private Long chatRoomId;       // 채팅방 ID
    private Long senderId;         // 보낸 사람 ID
    private String senderNickname; // 보낸 사람 닉네임
    private String content;        // 메시지 본문
    private String type;        // 메시지 타입
    private LocalDateTime sentAt;  // 보낸 시간
    private boolean isRead = false; // ✅ 읽음 여부 필드 추가

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
                .build();
    }
}
