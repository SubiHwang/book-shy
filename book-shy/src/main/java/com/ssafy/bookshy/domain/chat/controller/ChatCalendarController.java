package com.ssafy.bookshy.domain.chat.controller;

import com.ssafy.bookshy.domain.chat.dto.ChatCalendarEventDto;
import com.ssafy.bookshy.domain.chat.service.ChatCalendarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/chats/calendar")
@RequiredArgsConstructor
@Tag(name = "📅 거래 캘린더 API", description = "📅 도서 교환 및 대여 약속을 위한 일정 정보를 제공합니다.")
public class ChatCalendarController {

    private final ChatCalendarService chatCalendarService;

    @Operation(summary = "🗓️ 일정 조회", description = "📆 특정 날짜의 거래 약속 정보를 조회합니다.")
    @GetMapping
    public ResponseEntity<List<ChatCalendarEventDto>> getChatCalendar(
            @Parameter(description = "👤 사용자 ID") @RequestParam Long userId,
            @Parameter(description = "📅 조회 날짜", example = "2025-05-02")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(chatCalendarService.getCalendarEventsByDate(userId, date));
    }
}
