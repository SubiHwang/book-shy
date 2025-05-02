package com.ssafy.bookshy.domain.chat.controller;

import com.ssafy.bookshy.domain.chat.dto.ChatRoomDto;
import com.ssafy.bookshy.domain.chat.dto.CreateChatRoomRequestDto;
import com.ssafy.bookshy.domain.chat.service.ChatRoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
@Tag(name = "💬 채팅방 API", description = "💬 사용자 간 채팅방을 생성하고 목록을 조회합니다.")
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    @Operation(summary = "📑 채팅방 목록 조회", description = "🔍 사용자 ID로 자신이 참여 중인 채팅방 목록을 가져옵니다.")
    @GetMapping
    public ResponseEntity<List<ChatRoomDto>> getChatRooms(
            @Parameter(description = "👤 사용자 ID") @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(chatRoomService.getChatRooms(userId));
    }

    @Operation(summary = "➕ 채팅방 생성", description = "✨ 두 사용자 간 1:1 채팅방을 생성합니다.")
    @PostMapping
    public ResponseEntity<ChatRoomDto> createChatRoom(
            @RequestBody CreateChatRoomRequestDto request) {
        return ResponseEntity.ok(chatRoomService.createChatRoom(request));
    }
}