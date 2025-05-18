package com.ssafy.bookshy.domain.matching.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MatchResponseDto {
    private Long matchId;
    private Long chatRoomId;

    // 상대방 정보
    private String nickname;
    private String profileImageUrl;
    private Float temperature;
}
