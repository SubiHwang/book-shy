package com.ssafy.bookshy.domain.chat.controller;

import com.ssafy.bookshy.common.response.CommonResponse;
import com.ssafy.bookshy.domain.chat.dto.ChatRoomDto;
import com.ssafy.bookshy.domain.chat.dto.ChatRoomUserIdsResponseDto;
import com.ssafy.bookshy.domain.chat.service.ChatRoomService;
import com.ssafy.bookshy.domain.users.entity.Users;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
@Tag(name = "💬 채팅방 API", description = "💬 사용자 간 채팅방을 생성하고 목록을 조회합니다.")
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    @Operation(summary = "📑 채팅방 목록 조회", description = "🔍 사용자 ID로 자신이 참여 중인 채팅방 목록을 가져옵니다.")
    @GetMapping
    public CommonResponse<List<ChatRoomDto>> getChatRooms(
            @AuthenticationPrincipal Users user) {
        return CommonResponse.success(chatRoomService.getChatRooms(user.getUserId()));
    }

    @Operation(
            summary = "👥 채팅방 사용자 ID 조회",
            description = """
        ✅ 채팅방 ID를 이용하여 해당 채팅방의 두 사용자 ID (`userAId`, `userBId`)를 조회합니다.

        🔐 주로 WebSocket 메시지 전송 시 상대방 ID를 확인하거나,
        알림 전송 시 참여자 확인 용도로 사용됩니다.
        """
    )
    @ApiResponse(responseCode = "200", description = "사용자 ID 조회 성공")
    @GetMapping("/{chatRoomId}/participants")
    public CommonResponse<ChatRoomUserIdsResponseDto> getChatRoomUserIds(
            @Parameter(description = "채팅방 ID", example = "101")
            @PathVariable Long chatRoomId
    ) {
        return CommonResponse.success(
                ChatRoomUserIdsResponseDto.from(chatRoomService.getUserIdsByChatRoomId(chatRoomId))
        );
    }
}