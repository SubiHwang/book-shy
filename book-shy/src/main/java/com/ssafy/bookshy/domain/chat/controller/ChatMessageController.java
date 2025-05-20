package com.ssafy.bookshy.domain.chat.controller;

import com.ssafy.bookshy.common.response.CommonResponse;
import com.ssafy.bookshy.domain.chat.dto.AddEmojiRequestDto;
import com.ssafy.bookshy.domain.chat.dto.ChatImageUploadResponse;
import com.ssafy.bookshy.domain.chat.dto.ChatMessageResponseDto;
import com.ssafy.bookshy.domain.chat.service.ChatMessageService;
import com.ssafy.bookshy.domain.users.entity.Users;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Tag(name = "💌 채팅 메시지 API", description = "💌 채팅 메시지를 조회하거나 이모지를 추가할 수 있습니다.")
public class ChatMessageController {

    private final ChatMessageService chatMessageService;

    @Operation(summary = "📨 메시지 목록 조회", description = "🧾 채팅방 ID를 기준으로 모든 메시지를 시간순으로 조회합니다.")
    @GetMapping
    public CommonResponse<List<ChatMessageResponseDto>> getMessages(
            @Parameter(description = "🆔 채팅방 ID") @RequestParam Long roomId) {
        return CommonResponse.success(chatMessageService.getMessages(roomId));
    }

    @Operation(summary = "😍 이모지 추가", description = "❤️ 채팅 메시지에 이모지를 추가합니다.")
    @PostMapping("/{messageId}/emoji")
    public CommonResponse<Void> addEmoji(
            @Parameter(description = "💬 메시지 ID") @PathVariable Long messageId,
            @RequestBody AddEmojiRequestDto request) {
        chatMessageService.addEmojiToMessage(messageId, request.getEmoji());
        return CommonResponse.success();
    }

    @Operation(
            summary = "❌ 이모지 삭제",
            description = "😢 채팅 메시지에 등록된 이모지를 삭제합니다.",
            parameters = {
                    @Parameter(name = "messageId", description = "💬 이모지를 삭제할 메시지 ID", required = true, example = "123")
            }
    )
    @DeleteMapping("/{messageId}/emoji")
    public CommonResponse<Void> removeEmoji(
            @PathVariable Long messageId
    ) {
        chatMessageService.removeEmojiFromMessage(messageId);
        return CommonResponse.success();
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
    public CommonResponse<Void> markMessagesAsRead(
            @PathVariable Long chatRoomId,
            @AuthenticationPrincipal Users user
    ) {
        chatMessageService.markMessagesAsRead(chatRoomId, user.getUserId());
        return CommonResponse.success();
    }

    @Operation(
            summary = "🖼️ 채팅 이미지 업로드 및 전송",
            description = """
        사용자가 채팅 중 이미지를 업로드하면 서버에 저장하고,  
        해당 이미지의 URL을 반환함과 동시에 WebSocket 메시지를 전송합니다.
        
        ✅ 업로드된 이미지는 DB에 채팅 메시지로 저장되며,  
        채팅방 구독자에게 실시간으로 전달됩니다.
        
        ⚠️ 이미지 크기 제한 및 확장자 검사는 서버 내에서 처리됩니다.
        """,
            parameters = {
                    @Parameter(name = "chatRoomId", description = "💬 채팅방 ID", required = true, example = "1"),
                    @Parameter(name = "file", description = "🖼️ 업로드할 이미지 파일 (JPEG, PNG 등)", required = true)
            },
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "✅ 이미지 업로드 및 WebSocket 메시지 전송 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ChatImageUploadResponse.class),
                                    examples = @ExampleObject(value = """
                {
                  "status": "SUCCESS",
                  "message": "요청이 성공했습니다.",
                  "data": {
                    "imageUrl": "https://k12d204.p.ssafy.io/images/chat/abc123.jpg"
                  }
                }
                """)
                            )
                    ),
                    @ApiResponse(responseCode = "400", description = "❌ 유효하지 않은 이미지"),
                    @ApiResponse(responseCode = "500", description = "❌ 서버 오류 (파일 저장 실패 등)")
            }
    )
    @PostMapping("/image")
    public CommonResponse<ChatImageUploadResponse> uploadChatImage(
            @RequestParam Long chatRoomId,
            @RequestPart MultipartFile file,
            @AuthenticationPrincipal Users user
    ) {
        String imageUrl = chatMessageService.uploadChatImage(chatRoomId, user.getUserId(), file);
        return CommonResponse.success(new ChatImageUploadResponse(imageUrl));
    }



}
