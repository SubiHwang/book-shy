package com.ssafy.bookshy.domain.exchange.controller;

import com.ssafy.bookshy.domain.exchange.dto.ExchangeHistoryGroupDto;
import com.ssafy.bookshy.domain.exchange.dto.ExchangePromiseDto;
import com.ssafy.bookshy.domain.exchange.dto.ExchangeRequestDto;
import com.ssafy.bookshy.domain.exchange.dto.ReviewRequestDto;
import com.ssafy.bookshy.domain.exchange.service.ExchangeHistoryService;
import com.ssafy.bookshy.domain.exchange.service.ExchangePromiseService;
import com.ssafy.bookshy.domain.exchange.service.ExchangeService;
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
            summary = "📆 예정된 거래 약속 목록 조회",
            description = "사용자가 참여하고 있는 예정된 거래 약속 목록을 조회합니다. (요청 상태: PENDING 또는 ACCEPTED)",
            parameters = {
                    @Parameter(name = "page", description = "페이지 번호 (0부터 시작)", example = "0"),
                    @Parameter(name = "size", description = "페이지 크기", example = "10")
            },
            responses = {
                    @ApiResponse(responseCode = "200", description = "✅ 예정된 거래 약속 조회 성공")
            }
    )
    @GetMapping("/promises")
    public ResponseEntity<Page<ExchangePromiseDto>> getExchangePromises(
            @RequestHeader("X-User-Id") Long userId,
            @ParameterObject Pageable pageable
    ) {
        Page<ExchangePromiseDto> promises = exchangePromiseService.getPromiseList(userId, pageable);
        return ResponseEntity.ok(promises);
    }


    @Operation(
            summary = "📜 완료된 교환/대여 내역 조회",
            description = "사용자가 참여한 완료된 거래 내역을 연월별로 그룹화하여 조회합니다.",
            parameters = {
                    @Parameter(name = "page", description = "페이지 번호 (0부터 시작)", example = "0"),
                    @Parameter(name = "size", description = "페이지 크기", example = "10")
            },
            responses = {
                    @ApiResponse(responseCode = "200", description = "✅ 거래 내역 조회 성공")
            }
    )
    @GetMapping("/history")
    public ResponseEntity<List<ExchangeHistoryGroupDto>> getExchangeHistory(
            @RequestHeader("X-User-Id") Long userId,
            @ParameterObject Pageable pageable
    ) {
        List<ExchangeHistoryGroupDto> result = exchangeHistoryService.getCompletedExchanges(userId, pageable);
        return ResponseEntity.ok(result);
    }
}