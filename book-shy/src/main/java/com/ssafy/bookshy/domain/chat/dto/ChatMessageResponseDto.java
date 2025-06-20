package com.ssafy.bookshy.domain.chat.dto;

import com.ssafy.bookshy.domain.chat.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 서버가 클라이언트에게 응답으로 보내는 메시지 응답 DTO
 * TEXT, IMAGE 등 다양한 메시지 타입에 대응
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponseDto {

    private Long id;                   // 메시지 ID
    private Long chatRoomId;          // 채팅방 ID
    private Long senderId;            // 보낸 사람 ID
    private String senderNickname;    // 보낸 사람 닉네임
    private String content;           // 텍스트 메시지 내용 (TEXT 타입일 경우 사용)
    private String imageUrl;          // 이미지 메시지 URL (IMAGE 타입일 경우 사용)
    private String thumbnailUrl;      // 썸네일 이미지
    private String type;              // 메시지 타입 ("TEXT", "IMAGE")
    private LocalDateTime sentAt;     // 전송 시각
    private boolean isRead;           // 읽음 여부
    private String emoji;             // 이모지

    /**
     * ChatMessage 엔티티 → 응답 DTO로 변환
     */
    public static ChatMessageResponseDto from(ChatMessage message, String senderNickname) {
        return ChatMessageResponseDto.builder()
                .id(message.getId())
                .chatRoomId(message.getChatRoom().getId())
                .senderId(message.getSenderId())
                .senderNickname(senderNickname)
                .content(message.getContent())
                .imageUrl(message.getImageUrl()) // ✅ 이미지 메시지 대응
                .thumbnailUrl(message.getThumbnailUrl()) // ✅ 이미지 메시지 대응
                .sentAt(message.getTimestamp())
                .type(message.getType())
                .isRead(message.isRead())
                .emoji(message.getEmoji())
                .build();
    }
}
