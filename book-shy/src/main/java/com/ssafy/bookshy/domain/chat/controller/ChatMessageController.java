package com.ssafy.bookshy.domain.chat.controller;

import com.ssafy.bookshy.domain.chat.dto.AddEmojiRequestDto;
import com.ssafy.bookshy.domain.chat.dto.ChatMessageResponseDto;
import com.ssafy.bookshy.domain.chat.service.ChatMessageService;
import com.ssafy.bookshy.domain.users.entity.Users;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    @Operation(
            summary = "❌ 이모지 삭제",
            description = "😢 채팅 메시지에 등록된 이모지를 삭제합니다.",
            parameters = {
                    @Parameter(name = "messageId", description = "💬 이모지를 삭제할 메시지 ID", required = true, example = "123")
            }
    )
    @DeleteMapping("/{messageId}/emoji")
    public ResponseEntity<Void> removeEmoji(
            @PathVariable Long messageId
    ) {
        chatMessageService.removeEmojiFromMessage(messageId);
        return ResponseEntity.ok().build();
    }


    /**
     * ✅ 채팅방 메시지 읽음 처리
     */
    @Operation(
            summary = "👁️‍🗨️ 메시지 읽음 처리",
            description = """
            사용자가 채팅방의 메시지를 읽었을 때 호출하는 API입니다.  
            보낸 사람이 아닌 메시지 중 읽지 않은 메시지들을 모두 `읽음 처리`합니다.  
            - 🧠 senderId와 userId가 다를 때만 처리됩니다.
            - 📌 읽음 여부는 `isRead = true`로 반영됩니다.
            """
    )
    @PostMapping("/{chatRoomId}/read")
    public void markMessagesAsRead(
            @PathVariable Long chatRoomId,
            @AuthenticationPrincipal Users user
    ) {
        chatMessageService.markMessagesAsRead(chatRoomId, user.getUserId());
    }
}
