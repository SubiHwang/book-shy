package com.ssafy.bookshy.domain.chat.dto;

import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomDto {
    private Long id;
    private Long participantId;
    private Long partnerId;
    private String partnerName;
    private String partnerProfileImage;
    private String lastMessage;
    private String lastMessageTime;

    public static ChatRoomDto from(ChatRoom room,
                                   Long participantId,
                                   Long partnerId,
                                   String partnerName,
                                   String partnerProfileImage) {
        String lastMessage = room.getLastMessage();
        String lastMessageTime = room.getLastMessageTimestamp() != null
                ? room.getLastMessageTimestamp().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))
                : "";

        return ChatRoomDto.builder()
                .id(room.getId())
                .participantId(participantId)
                .partnerId(partnerId)
                .partnerName(partnerName)
                .partnerProfileImage(partnerProfileImage)
                .lastMessage(lastMessage)
                .lastMessageTime(lastMessageTime)
                .build();
    }
}
