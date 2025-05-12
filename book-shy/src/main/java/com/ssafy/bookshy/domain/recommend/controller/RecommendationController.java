package com.ssafy.bookshy.domain.recommend.controller;

import com.ssafy.bookshy.domain.book.dto.BookListTotalResponseDto;
import com.ssafy.bookshy.domain.recommend.dto.BookRecommendationResponseDto;
import com.ssafy.bookshy.domain.recommend.service.BookRecommendationService;
import com.ssafy.bookshy.domain.users.entity.Users;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommendations")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "🦒 책 추천 API", description = "사용자 맞춤형 책 추천 관련 API")
public class RecommendationController {

    private final BookRecommendationService bookRecommendationService;

    @Operation(
            summary = "맞춤형 책 추천 목록 조회",
            description = "사용자 맞춤형 책 추천 10권을 제공합니다. 카테고리, 작가, 베스트셀러, 유사 유저, 인기, 랜덤 기반 추천을 포함하여 다양한 책을 제공합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "추천 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = BookRecommendationResponseDto.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "잘못된 요청",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "string", example = "잘못된 요청")
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "사용자를 찾을 수 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "string", example = "사용자 정보가 없습니다.")
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "서버 오류",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "string", example = "서버 내부 오류")
                    )
            )
    })
    @GetMapping
    public ResponseEntity<BookListTotalResponseDto> getRecommendations(
            @Parameter(description = "인증된 사용자 정보", required = true)
            @AuthenticationPrincipal Users users) {

        try {
            // 사용자 ID를 가져와서 로그 기록
            Long userId = users.getUserId();
            log.info("사용자 {} 맞춤 추천 요청", userId);

            // 서비스에서 모든 추천 책 정보를 한 번에 가져옴
            BookListTotalResponseDto recommendations = bookRecommendationService.getAllRecommendations(userId);

            // 추천 결과를 클라이언트에 반환
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            // 기타 예외 처리
            log.error("책 추천 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
