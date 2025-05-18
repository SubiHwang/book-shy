package com.ssafy.bookshy.domain.matching.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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

    // 책
    private List<Long> myBookId;
    private List<String> myBookName;
    private List<Long> otherBookId;
    private List<String> otherBookName;
}
