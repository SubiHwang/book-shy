package com.ssafy.bookshy.domain.booknote.controller;

import com.ssafy.bookshy.domain.booknote.dto.BookNoteRequest;
import com.ssafy.bookshy.domain.booknote.dto.BookNoteResponseDto;
import com.ssafy.bookshy.domain.booknote.entity.BookNote;
import com.ssafy.bookshy.domain.booknote.service.BookNoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
            description = "사용자가 특정 도서에 대해 독후감을 작성합니다.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "작성자 ID, 도서 ID, 내용 포함",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "독후감 예시",
                                    value = "{\n  \"userId\": 1,\n  \"bookId\": 101,\n  \"content\": \"이 책은 내 인생을 바꿨어요! 😊\"\n}"
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
    public ResponseEntity<BookNote> create(@RequestBody BookNoteRequest request) {
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
                                    value = "{\n  \"content\": \"다시 읽어보니 더 많은 것을 느꼈어요.\" \n}"
                            )
                    )
            )
    )
    @PutMapping("/{reviewId}")
    public ResponseEntity<BookNote> update(
            @PathVariable Long reviewId,
            @RequestBody BookNoteRequest request) {
        return ResponseEntity.ok(bookNoteService.update(reviewId, request));
    }

    @GetMapping
    @Operation(
            summary = "📘 나의 독서 기록 조회",
            description = "나의 독후감(BookNote) 목록을 조회합니다.",
            parameters = {
                    @Parameter(name = "X-User-Id", description = "조회할 사용자 ID", required = true, example = "1")
            },
            responses = {
                    @ApiResponse(responseCode = "200", description = "✅ 조회 성공"),
                    @ApiResponse(responseCode = "400", description = "❌ 유효하지 않은 사용자 ID"),
                    @ApiResponse(responseCode = "500", description = "💥 서버 내부 오류")
            }
    )
    public ResponseEntity<List<BookNoteResponseDto>> getMyNotes(
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(bookNoteService.findNoteResponsesByUserId(userId));
    }
}
