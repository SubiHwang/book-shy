package com.ssafy.bookshy.domain.chat.controller;

import com.ssafy.bookshy.domain.chat.dto.AddEmojiRequestDto;
import com.ssafy.bookshy.domain.chat.dto.ChatMessageResponseDto;
import com.ssafy.bookshy.domain.chat.service.ChatMessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Tag(name = "💌 채팅 메시지 API", description = "💌 채팅 메시지를 조회하거나 이모지를 추가할 수 있습니다.")
public class ChatMessageController {

    private final ChatMessageService chatMessageService;

    @Operation(summary = "📨 메시지 목록 조회", description = "🧾 채팅방 ID를 기준으로 모든 메시지를 시간순으로 조회합니다.")
    @GetMapping
    public ResponseEntity<List<ChatMessageResponseDto>> getMessages(
            @Parameter(description = "🆔 채팅방 ID") @RequestParam Long roomId) {
        return ResponseEntity.ok(chatMessageService.getMessages(roomId));
    }

    @Operation(summary = "😍 이모지 추가", description = "❤️ 채팅 메시지에 이모지를 추가합니다.")
    @PostMapping("/{messageId}/emoji")
    public ResponseEntity<Void> addEmoji(
            @Parameter(description = "💬 메시지 ID") @PathVariable Long messageId,
            @RequestBody AddEmojiRequestDto request) {
        chatMessageService.addEmojiToMessage(messageId, request.getEmoji());
        return ResponseEntity.ok().build();
    }
}
