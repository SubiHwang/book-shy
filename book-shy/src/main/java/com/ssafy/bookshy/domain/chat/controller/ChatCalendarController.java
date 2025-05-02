package com.ssafy.bookshy.domain.chat.controller;

import com.ssafy.bookshy.domain.chat.dto.ChatCalendarEventDto;
import com.ssafy.bookshy.domain.chat.service.ChatCalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/chats/calendar")
@RequiredArgsConstructor
public class ChatCalendarController {

    private final ChatCalendarService chatCalendarService;

    @GetMapping
    public ResponseEntity<List<ChatCalendarEventDto>> getChatCalendar(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(chatCalendarService.getCalendarEventsByDate(userId, date));
    }
}
