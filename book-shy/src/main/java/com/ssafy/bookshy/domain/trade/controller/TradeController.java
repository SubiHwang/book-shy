package com.ssafy.bookshy.domain.trade.controller;

import com.ssafy.bookshy.domain.trade.dto.ExchangeRequestDto;
import com.ssafy.bookshy.domain.trade.service.TradeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trades")
@RequiredArgsConstructor
@Tag(name = "📚 Trade API", description = "📦 교환/대여 요청 관련 API")
public class TradeController {

    private final TradeService tradeService;

    @Operation(summary = "📩 도서 교환 요청", description = "두 사용자의 책을 교환하기 위한 요청을 생성합니다.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "✅ 교환 요청 완료"),
                    @ApiResponse(responseCode = "400", description = "🚫 잘못된 요청", content = @Content),
                    @ApiResponse(responseCode = "409", description = "⚠️ 중복된 요청", content = @Content)
            })
    @PostMapping("/exchange")
    public ResponseEntity<String> requestExchange(@RequestBody ExchangeRequestDto requestDto) {
        tradeService.requestExchange(requestDto);
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
        tradeService.requestRental(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("대여 요청이 완료되었습니다.");
    }
}