package com.ssafy.bookshy.domain.booknote.controller;

import com.ssafy.bookshy.domain.booknote.dto.BookQuoteRequest;
import com.ssafy.bookshy.domain.booknote.dto.BookQuoteResponseDto;
import com.ssafy.bookshy.domain.booknote.entity.BookQuote;
import com.ssafy.bookshy.domain.booknote.service.BookQuoteService;
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
@RequestMapping("/api/quotes")
@Tag(name = "💬 인용구 API", description = "도서에서 마음에 드는 문장이나 인상 깊은 인용구를 등록하는 API입니다.")
public class BookQuoteController {

    private final BookQuoteService bookQuoteService;

    @Operation(
            summary = "💡 인용구 등록",
            description = """
                🔒 <b>로그인 사용자</b>의 인증 정보를 기반으로 인상 깊었던 문장을 인용구로 등록합니다.
            """,
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "도서 ID와 인용구 내용 포함",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "인용구 예시",
                                    value = """
                                            {
                                              "bookId": 101,
                                              "content": "진짜 여행은 새로운 풍경을 보는 것이 아니라 새로운 시선을 갖는 것이다."
                                            }
                                            """
                            )
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "200", description = "✅ 인용구 등록 성공"),
                    @ApiResponse(responseCode = "400", description = "❌ 잘못된 요청"),
                    @ApiResponse(responseCode = "500", description = "💥 서버 오류")
            }
    )
    @PostMapping
    public ResponseEntity<BookQuote> create(
            @RequestBody BookQuoteRequest request,
            @AuthenticationPrincipal Users user
    ) {
        request.setUserId(user.getUserId());
        return ResponseEntity.ok(bookQuoteService.create(request));
    }

    @Operation(
            summary = "🖊️ 인용구 수정",
            description = "등록한 인용구 내용을 수정합니다.",
            parameters = {
                    @Parameter(name = "quoteId", description = "수정할 인용구 ID", example = "5")
            },
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "새로운 인용구 내용",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "수정 예시",
                                    value = """
                                            {
                                              "content": "읽는다는 것은 곧 새로운 삶을 만나는 것이다."
                                            }
                                            """
                            )
                    )
            )
    )
    @PutMapping("/{quoteId}")
    public ResponseEntity<BookQuote> update(
            @PathVariable Long quoteId,
            @RequestBody BookQuoteRequest request,
            @AuthenticationPrincipal Users user
    ) {
        request.setUserId(user.getUserId());
        return ResponseEntity.ok(bookQuoteService.update(quoteId, request));
    }

    @GetMapping
    @Operation(
            summary = "📙 나의 인용구 조회",
            description = """
                🔒 <b>로그인 사용자</b>의 인증 정보를 기반으로 나의 인용구 목록을 조회합니다.<br>
                - bookId를 지정하면 특정 도서의 인용구만 조회됩니다.
            """,
            parameters = {
                    @Parameter(name = "bookId", description = "📕 도서 ID (선택)", example = "101")
            },
            responses = {
                    @ApiResponse(responseCode = "200", description = "✅ 조회 성공"),
                    @ApiResponse(responseCode = "404", description = "❗ 도서가 존재하지 않음"),
                    @ApiResponse(responseCode = "500", description = "💥 서버 내부 오류")
            }
    )
    public ResponseEntity<List<BookQuoteResponseDto>> getMyQuotes(
            @RequestParam(required = false) Long bookId,
            @AuthenticationPrincipal Users user
    ) {
        return ResponseEntity.ok(bookQuoteService.findQuoteResponsesByUserId(user.getUserId(), bookId));
    }
}
