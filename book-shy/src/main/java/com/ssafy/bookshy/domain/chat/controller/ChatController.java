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
    public ResponseEntity<ChatRoomDto> createChatRoom(@RequestBody CreateChatRoomRequest request) {
        return ResponseEntity.ok(chatService.createChatRoom(request));
    }

    @GetMapping("/notifications/chat")
    public ResponseEntity<List<ChatNotificationDto>> getChatNotifications(@RequestParam Long userId) {
        return ResponseEntity.ok(chatService.getNotifications(userId));
    }

    @GetMapping("/chats/calendar")
    public ResponseEntity<List<ChatCalendarEventDto>> getChatCalendar(@RequestParam Long userId) {
        return ResponseEntity.ok(chatService.getCalendarEvents(userId));
    }

    @PostMapping("/messages")
    public ResponseEntity<ChatMessageDto> sendMessage(@RequestBody ChatMessageRequest request) {
        return ResponseEntity.ok(chatService.sendMessage(request));
    }

    @PostMapping("/messages/{messageId}/emoji")
    public ResponseEntity<Void> addEmoji(@PathVariable Long messageId, @RequestBody EmojiRequest request) {
        chatService.addEmoji(messageId, request);
        return ResponseEntity.ok().build();
    }
}
