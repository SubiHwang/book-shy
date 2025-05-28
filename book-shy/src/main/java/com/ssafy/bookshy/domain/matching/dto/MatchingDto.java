package com.ssafy.bookshy.domain.matching.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MatchingDto {

    private Long userId;
    private String nickname;
    private String address;
    private String profileImageUrl;
    private int temperature;

    private List<Long> myBookId;
    private List<String> myBookName;

    private List<Long> otherBookId;
    private List<String> otherBookName;

    private LocalDateTime matchedAt;
    private double score;
    private double distanceKm;

    public double getDistanceKm() {
        return Math.round(distanceKm * 10.0) / 10.0;
    }

    public static MatchingDto from(
            Long userId,
            String nickname,
            String address,
            String profileImageUrl,
            int temperature,
            List<Long> myBookId,
            List<String> myBookName,
            List<Long> otherBookId,
            List<String> otherBookName,
            LocalDateTime matchedAt,
            double score,
            double distanceKm
    ) {
        return MatchingDto.builder()
                .userId(userId)
                .nickname(nickname)
                .address(address)
                .profileImageUrl(profileImageUrl)
                .temperature(temperature)
                .myBookId(myBookId)
                .myBookName(myBookName)
                .otherBookId(otherBookId)
                .otherBookName(otherBookName)
                .matchedAt(matchedAt)
                .score(score)
                .distanceKm(distanceKm)
                .build();
    }
}
