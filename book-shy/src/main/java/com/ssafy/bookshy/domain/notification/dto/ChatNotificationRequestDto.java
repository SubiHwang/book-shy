package com.ssafy.bookshy.domain.notification.dto;

import lombok.*;

/**
 * 채팅 메시지에 대한 알림 요청 DTO
 */
@Data
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatNotificationRequestDto {
    private Long receiverId;
    private String senderNickName;
    private String content;
}
