package com.ssafy.bookshy.domain.recommend.dto;

import com.ssafy.bookshy.domain.book.dto.BookResponseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "종합 책 추천 응답 DTO")
public class BookRecommendationResponseDto {

    @Schema(description = "카테고리 기반 추천 책 목록 (4권)")
    private List<BookResponseDto> categoryRecommendations;

    @Schema(description = "작가 기반 추천 책 목록 (1권)")
    private List<BookResponseDto> authorRecommendations;

    @Schema(description = "유사 사용자 기반 추천 책 목록 (5권)")
    private List<BookResponseDto> similarUserRecommendations;

    @Schema(description = "다음 추천 갱신 시간 (캐싱 기준)")
    private String nextRefreshTime;
}