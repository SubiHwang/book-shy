package com.ssafy.bookshy.domain.exchange.controller;

import com.ssafy.bookshy.domain.exchange.dto.ExchangeHistoryGroupDto;
import com.ssafy.bookshy.domain.exchange.dto.ExchangePromiseDto;
import com.ssafy.bookshy.domain.exchange.dto.ExchangeRequestDto;
import com.ssafy.bookshy.domain.exchange.dto.ReviewRequestDto;
import com.ssafy.bookshy.domain.exchange.service.ExchangeHistoryService;
import com.ssafy.bookshy.domain.exchange.service.ExchangePromiseService;
import com.ssafy.bookshy.domain.exchange.service.ExchangeService;
import com.ssafy.bookshy.domain.users.entity.Users;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<String> requestExchange(@RequestBody ExchangeRequestDto requestDto) {
        exchangeService.requestExchange(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("교환 요청이 완료되었습니다.");
    }

    @Operation(summary = "📩 도서 대여 요청", description = "두 사용자의 책 대여를 위한 요청을 생성합니다.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "✅ 대여 요청 완료"),
                    @ApiResponse(responseCode = "400", description = "🚫 잘못된 요청", content = @Content),
                    @ApiResponse(responseCode = "409", description = "⚠️ 중복된 요청", content = @Content)
            })
    @PostMapping("/rental")
    public ResponseEntity<String> requestRental(@RequestBody ExchangeRequestDto requestDto) {
        exchangeService.requestRental(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("대여 요청이 완료되었습니다.");
    }

    @Operation(summary = "🌟 매너 평가 작성", description = "거래 후 상대방에 대한 매너 평가를 등록합니다.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "✅ 평가 완료"),
                    @ApiResponse(responseCode = "400", description = "🚫 잘못된 요청"),
                    @ApiResponse(responseCode = "409", description = "⚠️ 이미 작성된 리뷰")
            })
    @PostMapping("/reviews")
    public ResponseEntity<String> submitReview(@RequestBody ReviewRequestDto reviewDto) {
        exchangeService.submitReview(reviewDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("매너 평가가 완료되었습니다.");
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
    public ResponseEntity<List<ExchangePromiseDto>> getPromiseList(
            @AuthenticationPrincipal Users user
    ) {
        return ResponseEntity.ok(exchangePromiseService.getPromiseList(user));
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
    public ResponseEntity<List<ExchangeHistoryGroupDto>> getCompletedExchanges(
            @AuthenticationPrincipal Users user
    ) {
        return ResponseEntity.ok(exchangeHistoryService.getCompletedExchanges(user));
    }



    @Operation(summary = "✅ 거래 완료 처리", description = "사용자가 교환 완료 버튼을 눌러 거래를 완료 처리합니다.")
    @PostMapping("/complete/{requestId}")
    public ResponseEntity<String> completeExchange(
            @PathVariable Long requestId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        exchangeService.completeExchange(requestId, userId);
        return ResponseEntity.ok("거래가 완료되었습니다.");
    }

}