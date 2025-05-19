package com.ssafy.bookshy.domain.exchange.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

import java.util.List;

@Getter
@Schema(description = "📦 거래 리뷰 제출 요청 DTO")
public class ReviewSubmitRequest {

    @Schema(description = "거래 요청 ID", example = "100")
    private Long requestId;

    @Schema(description = "리뷰 참여자들의 사용자 ID 목록 (내 ID + 상대 ID)", example = "[1, 2]")
    private List<Long> userIds;

    @Schema(description = "전체 평점 (0.0 ~ 5.0)", example = "4.5")
    private double rating;

    @Schema(description = "세부 항목별 평점")
    private RatingDetail ratings;

    @Schema(description = "내가 넘긴 책들에 대한 정보 리스트")
    private List<ReviewedBook> books;

    @Schema(description = "거래 타입 : EXCHANGE(교환) or RENTAL(대여)")
    private String tradeType; // "EXCHANGE" or "RENTAL"

    @Getter
    @Schema(description = "🧾 세부 평점 항목")
    public static class RatingDetail {

        @Schema(description = "책 상태 점수", example = "5")
        private int condition;

        @Schema(description = "시간 준수 점수", example = "4")
        private int punctuality;

        @Schema(description = "매너 점수", example = "5")
        private int manner;
    }

    @Getter
    @Schema(description = "📚 리뷰 대상 도서 정보")
    public static class ReviewedBook {

        @Schema(description = "도서 제목", example = "미드나잇 라이브러리")
        private String title;

        @Schema(description = "도서 bookId", example = "101")
        private Long bookId;

        @Schema(description = "서재 도서 libraryId", example = "200")
        private Long libraryId;

        @Schema(description = "알라딘 itemId", example = "999999")
        private Long aladinItemId;

        @Schema(description = "매칭 시 도서인지 여부", example = "true")
        private boolean fromMatching;
    }
}
