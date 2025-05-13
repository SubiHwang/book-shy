package com.ssafy.bookshy.domain.trending.controller;

import com.ssafy.bookshy.domain.trending.dto.TrendingListResponseDto;
import com.ssafy.bookshy.domain.trending.service.TrendingSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trending")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "📘 인기 검색어 API", description = "인기 검색어를 제공하는 API입니다.")
public class TrendingSearchContoller {

    private final TrendingSearchService trendingSearchService;

    @Operation(
            summary = "실시간 인기 검색어 조회",
            description = "현재 실시간 인기 검색어 TOP 5를 조회합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "실시간 인기 검색어 조회 성공"
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "서버 내부 오류"
            )
    })
    @GetMapping
    public ResponseEntity<TrendingListResponseDto> getTrendingSearchList() {
        TrendingListResponseDto trendingListResponseDto = trendingSearchService.getTrendingSearchList();
        return ResponseEntity.ok(trendingListResponseDto);
    }
}