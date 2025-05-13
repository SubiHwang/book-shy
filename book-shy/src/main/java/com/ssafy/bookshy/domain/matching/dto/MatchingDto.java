package com.ssafy.bookshy.domain.matching.dto;

import com.ssafy.bookshy.domain.matching.entity.Matching;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchingDto {
    private Long matchId;
    private Long bookAId;
    private Long bookBId;
    private String status;
    private LocalDateTime matchedAt;
    private double score;

    public static MatchingDto from(Matching entity, double score) {
        return MatchingDto.builder()
                .matchId(entity.getMatchId())
                .bookAId(entity.getBookAId())
                .bookBId(entity.getBookBId())
                .status(entity.getStatus().name())
                .matchedAt(entity.getMatchedAt())
                .score(score)
                .build();
    }
}