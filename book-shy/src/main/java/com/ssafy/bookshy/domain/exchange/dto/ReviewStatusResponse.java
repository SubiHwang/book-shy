package com.ssafy.bookshy.domain.exchange.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "📊 리뷰 작성 여부 응답 DTO")
public class ReviewStatusResponse {

    @Schema(description = "리뷰 작성 여부 (내가 작성했는지)", example = "true")
    private boolean hasReviewed;

    @Schema(description = "리뷰 상태 상세 정보")
    private ReviewStatus reviewStatus;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "📝 리뷰 상태 상세 정보")
    public static class ReviewStatus {

        @Schema(description = "내가 작성한 리뷰 정보", nullable = true)
        private MyReview myReview;

        @Schema(description = "상대방 리뷰 정보")
        private PartnerReview partnerReview;
    }

}
