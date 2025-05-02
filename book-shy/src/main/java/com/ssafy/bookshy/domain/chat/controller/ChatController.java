package com.ssafy.bookshy.domain.chat.controller;

import com.ssafy.bookshy.domain.chat.dto.*;
import com.ssafy.bookshy.domain.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/chats")
    public ResponseEntity<List<ChatRoomDto>> getChatRooms(@RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(chatService.getChatRooms(userId));
    }

    @PostMapping("/chats")
    public ResponseEntity<ChatRoomDto> createChatRoom(@RequestBody CreateChatRoomRequestDto request) {
        return ResponseEntity.ok(chatService.createChatRoom(request));
    }

    // 이 API는 실제 알림 시스템 구현 전이면 주석 처리 고려
    // @GetMapping("/notifications/chat")
    // public ResponseEntity<List<ChatNotificationDto>> getChatNotifications(@RequestParam Long userId) {
    //     return ResponseEntity.ok(chatService.getNotifications(userId));
    // }

    @GetMapping("/chats/calendar")
    public ResponseEntity<List<ChatCalendarEventDto>> getChatCalendar(@RequestParam Long userId) {
        return ResponseEntity.ok(chatService.getChatRoomsByDate(userId, null)); // 날짜 파라미터 추가 필요
    }

    @PostMapping("/messages")
    public ResponseEntity<ChatMessageResponseDto> sendMessage(@RequestBody ChatMessageRequestDto request) {
        return ResponseEntity.ok(chatService.saveMessage(request));
    }

    @PostMapping("/messages/{messageId}/emoji")
    public ResponseEntity<Void> addEmoji(@PathVariable Long messageId, @RequestBody AddEmojiRequestDto request) {
        chatService.addEmojiToMessage(messageId, request.getEmoji());
        return ResponseEntity.ok().build();
    }
}
