package com.ssafy.bookshy.domain.chat.dto;

import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

/**
 * 💬 채팅방 목록에 사용되는 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomDto {
    private Long id;                     // 채팅방 ID
    private Long participantId;          // 현재 사용자의 ID
    private Long partnerId;              // 상대방 사용자 ID
    private String partnerName;          // 상대방 이름
    private String partnerProfileImage;  // 상대방 프리포일 이미지 URL
    private Float bookshyScore;          // 상대방 온도 점수
    private String lastMessage;          // 마지막 메시지
    private String lastMessageTime;      // 마지막 메시지 시간 (ISO 포맷)
    private int unreadCount;             // 안 읽은 메시지 수

    public static ChatRoomDto from(ChatRoom room,
                                   Long participantId,
                                   Long partnerId,
                                   String partnerName,
                                   String partnerProfileImage,
                                   Float bookshyScore,
                                   int unreadCount) {
        String lastMessage = room.getLastMessage();
        String lastMessageTime = room.getLastMessageTimestamp() != null
                ? room.getLastMessageTimestamp().toString()  // ISO 8601 포맷 유지
                : "";

        return ChatRoomDto.builder()
                .id(room.getId())
                .participantId(participantId)
                .partnerId(partnerId)
                .partnerName(partnerName)
                .partnerProfileImage(partnerProfileImage)
                .bookshyScore(bookshyScore)
                .lastMessage(lastMessage)
                .lastMessageTime(lastMessageTime)
                .unreadCount(unreadCount)
                .build();
    }
}
