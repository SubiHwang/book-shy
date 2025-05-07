package com.ssafy.bookshy.domain.recommend.controller;

import com.ssafy.bookshy.domain.recommend.dto.RecommendMessageKafkaDto;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
            @RequestBody RecommendMessageKafkaDto logDto) {
        String userId = getUserId();
        loggingService.processClientLog(userId, logDto);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "배치 이벤트 로깅", description = "클라이언트에서 발생한 여러 이벤트를 일괄 로깅합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로깅 성공"),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    @PostMapping("/client/batch")
    public ResponseEntity<Void> logClientEvents(
            @Parameter(description = "로깅할 이벤트 목록", required = true)
            @RequestBody List<RecommendMessageKafkaDto> logDtos) {
        String userId = getUserId();
        for (RecommendMessageKafkaDto logDto : logDtos) {
            loggingService.processClientLog(userId, logDto);
        }
        return ResponseEntity.ok().build();
    }

    private String getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return "anonymous";
    }
}