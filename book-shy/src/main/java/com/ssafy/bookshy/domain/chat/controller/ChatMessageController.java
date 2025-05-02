package com.ssafy.bookshy.domain.chat.controller;

import com.ssafy.bookshy.domain.chat.dto.AddEmojiRequestDto;
import com.ssafy.bookshy.domain.chat.dto.ChatMessageRequestDto;
import com.ssafy.bookshy.domain.chat.dto.ChatMessageResponseDto;
import com.ssafy.bookshy.domain.chat.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class ChatMessageController {

    private final ChatMessageService chatMessageService;

    @PostMapping
    public ResponseEntity<ChatMessageResponseDto> sendMessage(@RequestBody ChatMessageRequestDto request) {
        return ResponseEntity.ok(chatMessageService.saveMessage(request));
    }

    @PostMapping("/{messageId}/emoji")
    public ResponseEntity<Void> addEmoji(@PathVariable Long messageId, @RequestBody AddEmojiRequestDto request) {
        chatMessageService.addEmojiToMessage(messageId, request.getEmoji());
        return ResponseEntity.ok().build();
    }
}
