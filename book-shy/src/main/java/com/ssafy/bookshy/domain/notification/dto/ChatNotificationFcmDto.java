package com.ssafy.bookshy.domain.notification.dto;

import lombok.Builder;

@Builder
public record ChatNotificationFcmDto(
        Long receiverId,
        String senderNickName,
        String content,
        Long chatRoomId
) {}
