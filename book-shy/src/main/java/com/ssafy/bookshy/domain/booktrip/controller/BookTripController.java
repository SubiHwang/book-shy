package com.ssafy.bookshy.domain.booktrip.controller;

import com.ssafy.bookshy.common.response.CommonResponse;
import com.ssafy.bookshy.domain.booktrip.dto.*;
import com.ssafy.bookshy.domain.booktrip.service.BookTripService;
import com.ssafy.bookshy.domain.users.entity.Users;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/booktrip")
@RequiredArgsConstructor
@Tag(name = "📘 BookTrip API", description = "책의 여정(독서 경험) 기록 관련 API")
public class BookTripController {

    private final BookTripService bookTripService;

    @GetMapping
    @Operation(summary = "📚 특정 도서의 여정 목록 조회", description = "특정 도서에 대해 작성된 모든 여정(BookTrip)을 조회하며, 각 여정에는 작성자의 프로필과 로그인 사용자의 작성 여부가 포함됩니다.")
    public CommonResponse<List<BookTripWithUserDto>> getTrips(
            @RequestParam Long bookId,
            @Parameter(hidden = true) @AuthenticationPrincipal Users user) {
        //if (bookId == null) return ResponseEntity.badRequest().build();
        List<BookTripWithUserDto> result = bookTripService.getTripsWithUser(bookId, user);
        return CommonResponse.success(result);
    }

    @PostMapping
    @Operation(summary = "📝 책의 여정 등록", description = "현재 로그인한 사용자가 특정 도서에 대한 여정 기록을 작성합니다.")
    public CommonResponse<BookTripDto> createTrip(
            @Parameter(hidden = true)
            @AuthenticationPrincipal Users user,
            @RequestBody CreateBookTripRequest req) {
        // if (req.getBookId() == null) return ResponseEntity.badRequest().build();
        // if (req.getContent() == null || req.getContent().isBlank()) return ResponseEntity.badRequest().build();
        return CommonResponse.success(bookTripService.createTrip(user.getUserId(), req));
    }

    @PutMapping("/{tripId}")
    @Operation(summary = "✏️ 책의 여정 수정", description = "사용자가 작성한 여정 기록의 내용을 수정합니다.")
    public CommonResponse<BookTripDto> updateTrip(
            @Parameter(hidden = true)
            @AuthenticationPrincipal Users user,
            @Parameter(description = "수정할 여정 ID", required = true)
            @PathVariable Long tripId,
            @RequestBody UpdateBookTripRequest req) {
        //if (req.getContent() == null || req.getContent().isBlank()) return ResponseEntity.badRequest().build();
        return CommonResponse.success(bookTripService.updateTrip(user.getUserId(), tripId, req));
    }

    @DeleteMapping("/{tripId}")
    @Operation(summary = "❌ 책의 여정 삭제", description = "사용자가 작성한 여정 기록을 삭제합니다.")
    public CommonResponse<Void> deleteTrip(
            @Parameter(hidden = true)
            @AuthenticationPrincipal Users user,
            @Parameter(description = "삭제할 여정 ID", required = true)
            @PathVariable Long tripId) {
        bookTripService.deleteTrip(user.getUserId(), tripId);
        return CommonResponse.success();
    }

    @Operation(
            summary = "📘 서재에 없는 나의 책 여정 목록 + 도서 정보 조회",
            description = "🗃️ 로그인한 사용자가 작성한 책 여정 중, 현재 자신의 서재에는 존재하지 않는 도서와 그 여정을 함께 조회합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "✅ 여정 + 도서 목록 조회 성공", content = @Content(array = @ArraySchema(schema = @Schema(implementation = BookTripBookItemDto.class)))),
                    @ApiResponse(responseCode = "401", description = "❌ 인증되지 않은 사용자", content = @Content),
                    @ApiResponse(responseCode = "500", description = "💥 서버 내부 오류", content = @Content)
            }
    )
    @GetMapping("/my-only-not-in-library")
    public CommonResponse<List<BookTripBookItemDto>> getMyBookTripsWithBookInfo(
            @Parameter(hidden = true) @AuthenticationPrincipal Users user) {
        return CommonResponse.success(bookTripService.getTripsNotInMyLibraryWithBookInfo(user));
    }


}
