package com.ssafy.bookshy.domain.recommend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "검색 API", description = "검색 관련 API")
public class PopularKeywordController {
//    @Operation(summary = "인기 검색어 조회", description = "현재 인기 있는 검색어 목록을 조회합니다.")
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "조회 성공",
//                    content = @Content(schema = @Schema(implementation = PopularKeyword.class))),
//            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
//    })
//    @GetMapping("/search/popular")
//    public ResponseEntity<List<PopularKeyword>> getPopularKeywords(
//            @Parameter(description = "반환할 인기 검색어 개수", example = "10")
//            @RequestParam(defaultValue = "10") int limit) {
//
//        List<PopularKeyword> keywords = popularKeywordRepository.findAll(
//                Sort.by(Sort.Direction.ASC, "rank")
//        );
//
//        // 요청된 개수로 제한
//        if (keywords.size() > limit) {
//            keywords = keywords.subList(0, limit);
//        }
//
//        return ResponseEntity.ok(keywords);
//    }
}
