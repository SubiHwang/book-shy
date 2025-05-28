package com.ssafy.bookshy.domain.exchange.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "📌 세부 평점 항목")
public class RatingDetail {

    @Schema(description = "책 상태 점수 (1~5)", example = "5")
    private int condition;

    @Schema(description = "시간 약속 점수 (1~5)", example = "4")
    private int punctuality;

    @Schema(description = "매너 점수 (1~5)", example = "5")
    private int manner;
}