package com.ssafy.bookshy.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
}
