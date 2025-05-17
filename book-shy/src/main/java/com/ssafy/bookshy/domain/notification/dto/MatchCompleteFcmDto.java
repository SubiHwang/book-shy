package com.ssafy.bookshy.domain.notification.dto;

import lombok.Builder;

@Builder
public record MatchCompleteFcmDto(
    Long receiverId,
    String partnerName,
    Long chatRoomId
) {}
