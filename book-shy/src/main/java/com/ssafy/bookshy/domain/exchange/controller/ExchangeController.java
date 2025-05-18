package com.ssafy.bookshy.domain.exchange.controller;

import com.ssafy.bookshy.common.response.CommonResponse;
import com.ssafy.bookshy.domain.exchange.dto.ExchangeHistoryGroupDto;
import com.ssafy.bookshy.domain.exchange.dto.ExchangePromiseDto;
import com.ssafy.bookshy.domain.exchange.dto.ExchangeRequestDto;
import com.ssafy.bookshy.domain.exchange.dto.ReviewSubmitRequest;
import com.ssafy.bookshy.domain.exchange.service.ExchangeHistoryService;
import com.ssafy.bookshy.domain.exchange.service.ExchangePromiseService;
import com.ssafy.bookshy.domain.exchange.service.ExchangeService;
import com.ssafy.bookshy.domain.users.entity.Users;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trades")
@RequiredArgsConstructor
@Tag(name = "📚 Trade API", description = "📦 교환/대여 요청 관련 API")
public class ExchangeController {

    private final ExchangeService exchangeService;
    private final ExchangePromiseService exchangePromiseService;
    private final ExchangeHistoryService exchangeHistoryService;

    @Operation(summary = "📩 도서 교환 요청", description = "두 사용자의 책을 교환하기 위한 요청을 생성합니다.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "✅ 교환 요청 완료"),
                    @ApiResponse(responseCode = "400", description = "🚫 잘못된 요청", content = @Content),
                    @ApiResponse(responseCode = "409", description = "⚠️ 중복된 요청", content = @Content)
            })
    @PostMapping("/exchange")
    public CommonResponse requestExchange(@RequestBody ExchangeRequestDto requestDto) {
        exchangeService.requestExchange(requestDto);
        return CommonResponse.success();
    }

    @Operation(summary = "📩 도서 대여 요청", description = "두 사용자의 책 대여를 위한 요청을 생성합니다.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "✅ 대여 요청 완료"),
                    @ApiResponse(responseCode = "400", description = "🚫 잘못된 요청", content = @Content),
                    @ApiResponse(responseCode = "409", description = "⚠️ 중복된 요청", content = @Content)
            })
    @PostMapping("/rental")
    public CommonResponse requestRental(@RequestBody ExchangeRequestDto requestDto) {
        exchangeService.requestRental(requestDto);
        return CommonResponse.success();
    }

    @Operation(
            summary = "📅 나의 교환 약속 조회",
            description = """
                    📌 <b>로그인 사용자</b>가 잡아놓은 <b>예정된 도서 교환 약속 목록</b>을 조회합니다.<br>
                    - 상대방 정보와 약속된 도서, 예정된 시간 등이 함께 제공됩니다.
                    """,
            responses = {
                    @ApiResponse(responseCode = "200", description = "조회 성공"),
                    @ApiResponse(responseCode = "401", description = "인증 실패"),
                    @ApiResponse(responseCode = "500", description = "서버 오류")
            }
    )
    @GetMapping("/promise")
    public CommonResponse<List<ExchangePromiseDto>> getPromiseList(
            @AuthenticationPrincipal Users user
    ) {
        return CommonResponse.success(exchangePromiseService.getPromiseList(user));
    }


    @Operation(
            summary = "📜 나의 교환 이력 조회",
            description = """
                    ✅ <b>로그인 사용자의 인증 정보를 기반으로</b> 완료된 도서 교환 이력을 조회합니다.<br>
                    - 상대방 정보와 교환한 도서(받은 책/준 책)의 정보가 함께 제공됩니다.<br>
                    - 연도-월 단위로 그룹화되어 반환됩니다.
                    """,
            responses = {
                    @ApiResponse(responseCode = "200", description = "조회 성공"),
                    @ApiResponse(responseCode = "401", description = "인증 실패"),
                    @ApiResponse(responseCode = "500", description = "서버 오류")
            }
    )
    @GetMapping("/history")
    public CommonResponse<List<ExchangeHistoryGroupDto>> getCompletedExchanges(
            @AuthenticationPrincipal Users user
    ) {
        return CommonResponse.success(exchangeHistoryService.getCompletedExchanges(user));
    }

    @Operation(
            summary = "📝 매너 평가 + 거래 완료 제출",
            description = """
                📌 교환/대여가 완료된 후 <b>상대방에 대한 평가</b>를 제출합니다.<br>
                - 총점과 세부 항목(책 상태, 약속 시간, 매너)을 입력합니다.<br>
                - 내가 넘긴 책 목록도 함께 제출합니다.<br>
                - 양쪽 사용자가 모두 리뷰를 작성한 경우 거래 상태가 <code>COMPLETED</code>로 변경되며, 교환된 책들은 서로의 서재로 이동합니다.
                """,
            responses = {
                    @ApiResponse(responseCode = "201", description = "🎉 리뷰 제출 및 거래 완료 처리 성공"),
                    @ApiResponse(responseCode = "400", description = "🚫 잘못된 요청 데이터", content = @Content),
                    @ApiResponse(responseCode = "409", description = "⚠️ 이미 리뷰를 제출함", content = @Content),
                    @ApiResponse(responseCode = "500", description = "💥 서버 오류", content = @Content)
            }
    )
    @PostMapping("/reviews")
    public CommonResponse submitTradeReview(
            @AuthenticationPrincipal Users user,
            @RequestBody ReviewSubmitRequest request
    ) {
        exchangeService.submitReview(user.getUserId(), request);
        return CommonResponse.success("리뷰가 성공적으로 제출되었습니다.");
    }
}