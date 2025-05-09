package com.ssafy.bookshy.domain.chat.controller;

import com.ssafy.bookshy.domain.chat.dto.ChatRoomDto;
import com.ssafy.bookshy.domain.chat.service.ChatRoomService;
import com.ssafy.bookshy.domain.users.entity.Users;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
            @AuthenticationPrincipal Users user) {
        return ResponseEntity.ok(chatRoomService.getChatRooms(user.getUserId()));
    }

}