package com.ssafy.bookshy.domain.trending.controller;

import com.ssafy.bookshy.domain.trending.service.TrendingSearchService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trending")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "👙 실시간 인기 검색어 API", description = "실시간 인기 검색어 관련 API")
public class TrendingSearchContoller {

    private final TrendingSearchService trendingSearchService;

//    @GetMapping
//    public ResponseEntity<TrendingResponseDto> getTrendingSearchList(@AuthenticationPrincipal Users users) {
//
//        //  TrendingResponseDto trendingResponseDto = trendingSearchService.getTrendingSearchList(users.getUserId());
//
//        return ResponseEntity.ok();
//    }


}
