package com.ssafy.bookshy.domain.chat.controller;

import com.ssafy.bookshy.common.response.CommonResponse;
import com.ssafy.bookshy.domain.chat.dto.ChatCalendarCreateRequestDto;
import com.ssafy.bookshy.domain.chat.dto.ChatCalendarCreateResponseDto;
import com.ssafy.bookshy.domain.chat.dto.ChatCalendarEventDto;
import com.ssafy.bookshy.domain.chat.service.ChatCalendarService;
import com.ssafy.bookshy.domain.users.entity.Users;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/chats/calendar")
@RequiredArgsConstructor
@Tag(name = "📅 거래 일정 캘린더", description = "도서 교환 및 대여 약속을 위한 일정 정보를 등록하고 조회합니다.")
public class ChatCalendarController {

    private final ChatCalendarService chatCalendarService;

    @Operation(
            summary = "📌 채팅방 ID 기반 거래 일정 단건 조회",
            description = """
        📌 특정 채팅방의 교환/대여 일정을 조회합니다.<br>
        - `roomId`로 일정을 식별하며, <b>거래 리뷰를 위한 평가 화면</b>에서 사용됩니다.
        """,
            parameters = {
                    @Parameter(name = "roomId", description = "📌 조회할 채팅방 ID", required = true, example = "123")
            },
            responses = {
                    @ApiResponse(responseCode = "200", description = "✅ 일정 조회 성공", content = @Content(schema = @Schema(implementation = ChatCalendarEventDto.class))),
                    @ApiResponse(responseCode = "400", description = "❌ 잘못된 요청 또는 파라미터 누락"),
                    @ApiResponse(responseCode = "404", description = "❌ 해당 roomId에 해당하는 일정 없음"),
                    @ApiResponse(responseCode = "500", description = "💥 서버 오류")
            }
    )
    @GetMapping(params = "roomId")
    public CommonResponse<ChatCalendarEventDto> getCalendarByRoomId(
            @RequestParam("roomId") Long roomId
    ) {
        return CommonResponse.success(chatCalendarService.getCalendarByRoomId(roomId));
    }


    @Operation(
            summary = "📆 교환/대여 일정 등록",
            description = """
        📦 채팅방 내 도서 교환(EXCHANGE) 또는 대여(RENTAL) 일정을 등록합니다.<br>
        📌 동시에 `exchange_requests` 테이블에 거래 요청도 함께 저장됩니다.<br><br>

        ✅ `type`이 EXCHANGE인 경우 `eventDate` 필수<br>
        ✅ `type`이 RENTAL인 경우 `startDate`, `endDate` 필수<br>
        ⚠️ `userIds`에는 요청자와 응답자 ID가 정확히 2개 포함되어야 합니다.
        """,
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    description = "📑 등록할 거래 일정 정보",
                    content = @Content(schema = @Schema(implementation = ChatCalendarCreateRequestDto.class))
            ),
            responses = {
                    @ApiResponse(responseCode = "200", description = "✅ 거래 요청 및 일정 등록 성공",
                            content = @Content(schema = @Schema(implementation = ChatCalendarCreateResponseDto.class))),
                    @ApiResponse(responseCode = "400", description = "❌ 잘못된 입력 (날짜/유형/ID 누락 등)"),
                    @ApiResponse(responseCode = "404", description = "❌ 채팅방 또는 사용자/도서 미존재"),
                    @ApiResponse(responseCode = "500", description = "💥 서버 내부 오류")
            }
    )
    @PostMapping
    public CommonResponse<ChatCalendarCreateResponseDto> createCalendarWithExchange(
            @org.springframework.web.bind.annotation.RequestBody ChatCalendarCreateRequestDto dto,
            @AuthenticationPrincipal Users user) {
        return CommonResponse.success(chatCalendarService.createCalendarWithRequest(dto));
    }

    @Operation(
            summary = "🗑️ 교환/대여 일정 삭제",
            description = "🔐 채팅방 ID(`roomId`)를 기반으로 등록된 일정 1건을 삭제합니다.\n\n" +
                    "- 해당 채팅방에 일정이 존재하지 않으면 예외를 반환합니다.\n" +
                    "- 주로 거래 약속 취소 또는 변경 시 사용됩니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "✅ 일정 삭제 성공"),
                    @ApiResponse(responseCode = "400", description = "❌ 잘못된 요청 또는 roomId 누락"),
                    @ApiResponse(responseCode = "404", description = "❌ 해당 채팅방에 일정이 존재하지 않음")
            }
    )
    @DeleteMapping
    public CommonResponse<Void> deleteCalendarByRoomId(
            @Parameter(description = "채팅방 ID", example = "42")
            @RequestParam Long roomId,
            @AuthenticationPrincipal Users user
    ) {
        chatCalendarService.deleteCalendarByRoomId(roomId);
        return CommonResponse.success();
    }

    @Operation(
            summary = "✏️ 교환/대여 일정 수정",
            description = """
        📌 기존의 거래 일정(`calendarId`)과 거래 요청(`requestId`)을 수정합니다.\n
        - 일정 제목, 설명, 날짜 정보만 수정됩니다.\n
        ✅ `type`이 EXCHANGE인 경우 `eventDate` 필수\n
        ✅ `type`이 RENTAL인 경우 `startDate`, `endDate` 필수
        """,
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    description = "📝 수정할 일정 정보",
                    content = @Content(schema = @Schema(implementation = ChatCalendarUpdateRequestDto.class))
            ),
            responses = {
                    @ApiResponse(responseCode = "200", description = "✅ 일정 수정 성공",
                            content = @Content(schema = @Schema(implementation = ChatCalendarCreateResponseDto.class))),
                    @ApiResponse(responseCode = "400", description = "❌ 잘못된 입력 (날짜/유형 누락 등)"),
                    @ApiResponse(responseCode = "404", description = "❌ 일정 또는 요청 정보 없음")
            }
    )
    @PutMapping
    public CommonResponse<ChatCalendarCreateResponseDto> updateCalendar(
            @org.springframework.web.bind.annotation.RequestBody ChatCalendarUpdateRequestDto dto,
            @AuthenticationPrincipal Users user
    ) {
        return CommonResponse.success(chatCalendarService.updateCalendar(dto));
    }
}
