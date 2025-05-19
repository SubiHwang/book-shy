package com.ssafy.bookshy.domain.users.controller;

import com.ssafy.bookshy.domain.users.dto.FavoriteCategoryResponseDto;
import com.ssafy.bookshy.domain.users.service.UserStatsService;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.common.response.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "📈 사용자 통계 API", description = "사용자 독서 통계 및 분석 관련 API입니다.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stats")
public class UserStatsController {

    private final UserStatsService userStatsService;

    @Operation(
            summary = "📊 선호 카테고리 분석",
            description = """
                    사용자의 라이브러리 데이터를 기반으로 가장 많이 읽은 카테고리를 분석합니다.  
                    전처리된 대표 카테고리를 기준으로 `"OO 도서 마니아입니다!"` 라는 메시지를 반환합니다.
                    """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "분석 성공"),
            @ApiResponse(responseCode = "400", description = "유효하지 않은 사용자 ID"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @GetMapping("/favorite-category")
    public CommonResponse<FavoriteCategoryResponseDto> getFavoriteCategory(
            @Parameter(description = "분석 대상 사용자 ID", example = "1")
            @RequestParam Long userId
    ) {
        FavoriteCategoryResponseDto result = userStatsService.getFavoriteCategory(userId);
        return CommonResponse.success(result);
    }
}
