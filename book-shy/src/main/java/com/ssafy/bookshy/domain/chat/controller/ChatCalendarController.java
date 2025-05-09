package com.ssafy.bookshy.domain.chat.controller;

import com.ssafy.bookshy.domain.chat.dto.ChatCalendarCreateRequestDto;
import com.ssafy.bookshy.domain.chat.dto.ChatCalendarCreateResponseDto;
import com.ssafy.bookshy.domain.chat.dto.ChatCalendarEventDto;
import com.ssafy.bookshy.domain.chat.service.ChatCalendarService;
import com.ssafy.bookshy.domain.users.entity.Users;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody; // ✅ Swagger용 (문서 설명용)
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/chats/calendar")
@RequiredArgsConstructor
@Tag(name = "📅 거래 일정 캘린더", description = "도서 교환 및 대여 약속을 위한 일정 정보를 등록하고 조회합니다.")
public class ChatCalendarController {

    private final ChatCalendarService chatCalendarService;

    @Operation(
            summary = "🗓️ 거래 일정 조회",
            description = "📆 사용자가 등록한 특정 날짜의 교환/대여 일정을 조회합니다.",
            parameters = {
                    @Parameter(name = "userId", description = "👤 사용자 ID", required = true, example = "1"),
                    @Parameter(name = "date", description = "📅 조회할 날짜 (ISO 형식: yyyy-MM-dd)", required = true, example = "2025-05-02")
            },
            responses = {
                    @ApiResponse(responseCode = "200", description = "✅ 일정 목록 조회 성공", content = @Content(schema = @Schema(implementation = ChatCalendarEventDto.class))),
                    @ApiResponse(responseCode = "400", description = "❌ 잘못된 요청 또는 날짜 형식 오류"),
                    @ApiResponse(responseCode = "500", description = "💥 서버 내부 오류")
            }
    )
    @GetMapping
    public ResponseEntity<List<ChatCalendarEventDto>> getChatCalendar(
            @AuthenticationPrincipal Users user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(chatCalendarService.getCalendarEventsByDate(user.getUserId(), date));
    }

    @Operation(
            summary = "📌 거래 일정 등록",
            description = "📥 사용자 간 <b>교환(EXCHANGE)</b> 또는 <b>대여(RENTAL)</b> 일정을 캘린더에 등록합니다.",
            requestBody = @RequestBody(
                    description = "📑 등록할 거래 일정 정보",
                    required = true,
                    content = @Content(schema = @Schema(implementation = ChatCalendarCreateRequestDto.class))
            ),
            responses = {
                    @ApiResponse(responseCode = "200", description = "✅ 일정 등록 성공", content = @Content(schema = @Schema(implementation = ChatCalendarCreateResponseDto.class))),
                    @ApiResponse(responseCode = "400", description = "❌ 입력값 오류 또는 날짜 누락"),
                    @ApiResponse(responseCode = "404", description = "❌ 존재하지 않는 교환 요청 ID"),
                    @ApiResponse(responseCode = "500", description = "💥 서버 내부 오류")
            }
    )
    @PostMapping
    public ResponseEntity<ChatCalendarCreateResponseDto> createCalendar(
            @org.springframework.web.bind.annotation.RequestBody ChatCalendarCreateRequestDto dto) { // ✅ 실제 동작용 RequestBody
        return ResponseEntity.ok(chatCalendarService.createCalendar(dto));
    }
}
