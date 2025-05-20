package com.ssafy.bookshy.domain.chat.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ChatOpponentResponseDto {
    private Long userId;
    private String nickname;
    private String profileImageUrl;
    private Float temperature;
}
