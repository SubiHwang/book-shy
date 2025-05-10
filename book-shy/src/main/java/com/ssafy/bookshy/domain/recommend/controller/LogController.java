package com.ssafy.bookshy.domain.recommend.controller;

import com.ssafy.bookshy.domain.recommend.dto.ClientLogRequestDto;
import com.ssafy.bookshy.domain.recommend.service.LoggingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/logs")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "로깅 API", description = "클라이언트 이벤트 로깅 관련 API")
public class LogController {

    private final LoggingService loggingService;

    @Operation(summary = "단일 이벤트 로깅", description = "클라이언트에서 발생한 단일 이벤트를 로깅합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로깅 성공"),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    @PostMapping("/client")
    public ResponseEntity<Void> logClientEvent(
            @Parameter(description = "로깅할 이벤트 정보", required = true)
            @RequestBody ClientLogRequestDto logDto) {
        loggingService.processClientLog(logDto);
        return ResponseEntity.ok().build();
    }

}