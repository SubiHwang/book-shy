package com.ssafy.bookshy.domain.booknote.controller;

import com.ssafy.bookshy.domain.booknote.dto.BookNoteRequest;
import com.ssafy.bookshy.domain.booknote.dto.BookNoteResponseDto;
import com.ssafy.bookshy.domain.booknote.entity.BookNote;
import com.ssafy.bookshy.domain.booknote.service.BookNoteService;
import com.ssafy.bookshy.domain.users.entity.Users;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notes")
@Tag(name = "📘 독후감 API", description = "책에 대한 감상과 생각을 기록하는 API입니다.")
public class BookNoteController {

    private final BookNoteService bookNoteService;

    @Operation(
            summary = "✏️ 독후감 등록",
            description = """
                🔒 <b>로그인 사용자</b>의 인증 정보를 기반으로 독후감을 작성합니다.<br>
                - 도서 ID와 내용만 전달하면 됩니다.
            """,
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "도서 ID, 내용 포함",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "독후감 예시",
                                    value = """
                                            {
                                              "bookId": 101,
                                              "content": "이 책은 내 인생을 바꿨어요! 😊"
                                            }
                                            """
                            )
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "200", description = "✅ 등록 성공"),
                    @ApiResponse(responseCode = "400", description = "❌ 잘못된 요청"),
                    @ApiResponse(responseCode = "500", description = "💥 서버 오류")
            }
    )
    @PostMapping
    public ResponseEntity<BookNote> create(
            @RequestBody BookNoteRequest request,
            @AuthenticationPrincipal Users user
    ) {
        request.setUserId(user.getUserId());
        return ResponseEntity.ok(bookNoteService.create(request));
    }

    @Operation(
            summary = "📝 독후감 수정",
            description = "작성한 독후감의 내용을 수정합니다.",
            parameters = {
                    @Parameter(name = "reviewId", description = "수정할 독후감 ID", example = "3")
            },
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "수정할 내용",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "수정 예시",
                                    value = """
                                            {
                                              "content": "다시 읽어보니 더 많은 것을 느꼈어요."
                                            }
                                            """
                            )
                    )
            )
    )
    @PutMapping("/{reviewId}")
    public ResponseEntity<BookNote> update(
            @PathVariable Long reviewId,
            @RequestBody BookNoteRequest request,
            @AuthenticationPrincipal Users user
    ) {
        request.setUserId(user.getUserId());
        return ResponseEntity.ok(bookNoteService.update(reviewId, request));
    }

    @GetMapping
    @Operation(
            summary = "📘 나의 독서 기록 전체 조회",
            description = """
        🔒 <b>로그인 사용자</b>의 인증 정보를 기반으로 <b>내가 작성한 모든 독후감 목록</b>을 조회합니다.<br>
        - 도서 정보(title, author 등)와 함께 반환됩니다.
        """,
            responses = {
                    @ApiResponse(responseCode = "200", description = "✅ 조회 성공"),
                    @ApiResponse(responseCode = "500", description = "💥 서버 내부 오류")
            }
    )
    public ResponseEntity<List<BookNoteResponseDto>> getMyNotes(
            @AuthenticationPrincipal Users user
    ) {
        return ResponseEntity.ok(bookNoteService.findNoteResponsesByUserId(user.getUserId()));
    }

    @GetMapping("/by-book")
    @Operation(
            summary = "📕 특정 도서에 대한 나의 독후감 조회",
            description = """
        🔒 <b>로그인 사용자</b>의 인증 정보를 기반으로 <b>특정 도서(bookId)에 대한 독후감</b>을 조회합니다.<br>
        - 존재하지 않는 도서 ID를 입력할 경우 404 에러가 발생할 수 있습니다.
        """,
            parameters = {
                    @Parameter(name = "bookId", description = "📚 조회할 도서의 ID", required = true, example = "101")
            },
            responses = {
                    @ApiResponse(responseCode = "200", description = "✅ 조회 성공"),
                    @ApiResponse(responseCode = "404", description = "❌ 도서를 찾을 수 없음"),
                    @ApiResponse(responseCode = "500", description = "💥 서버 내부 오류")
            }
    )
    public ResponseEntity<List<BookNoteResponseDto>> getMyNoteByBookId(
            @RequestParam Long bookId,
            @AuthenticationPrincipal Users user
    ) {
        return ResponseEntity.ok(bookNoteService.findNoteResponsesByUserIdAndBookId(user.getUserId(), bookId));
    }

}
