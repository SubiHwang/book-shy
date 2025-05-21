package com.ssafy.bookshy.domain.exchange.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "🙋‍♂️ 내가 작성한 리뷰 정보")
public class MyReview {

    @Schema(description = "평균 평점 (0.0 ~ 5.0)", example = "4.7")
    private double rating;

    @Schema(description = "세부 항목별 평점")
    private RatingDetail ratings;

    @Schema(description = "제출 일시 (ISO 8601)", example = "2024-03-21T15:30:00")
    private LocalDateTime submittedAt;

    public MyReview(com.ssafy.bookshy.domain.exchange.entity.ExchangeRequestReview review) {
        this.rating = review.getRating();
        this.submittedAt = review.getCreatedAt();
        this.ratings = new RatingDetail(review.getCondition(), review.getPunctuality(), review.getManner());
    }
}