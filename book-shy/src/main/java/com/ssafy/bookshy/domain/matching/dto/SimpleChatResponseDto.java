package com.ssafy.bookshy.domain.matching.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SimpleChatResponseDto {
    private Long chatRoomId;
    private String nickname;
    private String profileImageUrl;
    private Float temperature;
}
