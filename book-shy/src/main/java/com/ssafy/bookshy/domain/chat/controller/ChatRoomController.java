package com.ssafy.bookshy.domain.chat.controller;

import com.ssafy.bookshy.domain.chat.dto.ChatRoomDto;
import com.ssafy.bookshy.domain.chat.dto.CreateChatRoomRequestDto;
import com.ssafy.bookshy.domain.chat.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    @GetMapping
    public ResponseEntity<List<ChatRoomDto>> getChatRooms(@RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(chatRoomService.getChatRooms(userId));
    }

    @PostMapping
    public ResponseEntity<ChatRoomDto> createChatRoom(@RequestBody CreateChatRoomRequestDto request) {
        return ResponseEntity.ok(chatRoomService.createChatRoom(request));
    }
}
