package com.ssafy.bookshy.domain.chat.controller;

import com.ssafy.bookshy.common.response.CommonResponse;
import com.ssafy.bookshy.domain.chat.dto.ChatOpponentResponseDto;
import com.ssafy.bookshy.domain.chat.dto.ChatRoomDto;
import com.ssafy.bookshy.domain.chat.dto.ChatRoomUserIdsResponseDto;
import com.ssafy.bookshy.domain.chat.service.ChatRoomService;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.book.dto.BookResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
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

    @Operation(
            summary = "📚 현재 대여 중인 도서 전체 조회",
            description = """
        📦 현재 로그인 사용자가 **대여한 상태인 도서들**을 모두 조회합니다.

        - 사용자의 참여 중인 채팅방에서 연결된 일정(`ChatCalendar`)을 가져옵니다.
        - 일정이 현재 날짜 기준으로 `rentalStartDate ~ rentalEndDate` 사이에 포함되는 경우만 필터링합니다.
        - 해당 일정에 연결된 거래 요청(`ExchangeRequest`)이 RENTAL 타입인지 확인합니다.
        - 거래 상대방의 도서 정보를 조회하여 반환합니다.

        ✅ 독서 기록 swiper, 리뷰 작성 등에서 사용됩니다.
        """
    )
    @ApiResponse(responseCode = "200", description = "대여 도서 목록 조회 성공")
    @GetMapping("/rental-books")
    public CommonResponse<List<BookResponseDto>> getRentalBooksInUse(
            @AuthenticationPrincipal Users user
    ) {
        return CommonResponse.success(chatRoomService.getRentalBooksInUse(user.getUserId()));
    }

    @Operation(
            summary = "👤 채팅 상대방 정보 조회",
            description = """
        📬 채팅방 ID를 기준으로, 현재 로그인 사용자가 아닌 **상대방의 프로필 정보**를 조회합니다.
        
        - 상대방 userId
        - 북끄지수
        - 프로필 이미지 URL
        - 닉네임

        ✅ 채팅방 입장 시 상대 사용자 정보를 표시하는 데 사용됩니다.
        """
    )
    @ApiResponse(responseCode = "200", description = "상대방 정보 조회 성공")
    @GetMapping("/{chatRoomId}/opponent")
    public CommonResponse<ChatOpponentResponseDto> getChatOpponentInfo(
            @Parameter(description = "채팅방 ID", example = "89")
            @PathVariable Long chatRoomId,
            @AuthenticationPrincipal Users user
    ) {
        return CommonResponse.success(
                chatRoomService.getOpponentInfo(chatRoomId, user.getUserId())
        );
    }
}