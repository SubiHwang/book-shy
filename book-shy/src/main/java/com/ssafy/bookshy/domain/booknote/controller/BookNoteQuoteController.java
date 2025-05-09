package com.ssafy.bookshy.domain.booknote.controller;

import com.ssafy.bookshy.domain.booknote.dto.BookNoteQuoteRequest;
import com.ssafy.bookshy.domain.booknote.dto.BookNoteQuoteResponse;
import com.ssafy.bookshy.domain.booknote.service.BookNoteQuoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notes-with-quote")
@Tag(name = "📝 독후감 + 💬 인용구 통합 API", description = "한 번의 요청으로 독후감과 인용구를 함께 등록할 수 있는 API입니다.")
public class BookNoteQuoteController {

    private final BookNoteQuoteService bookNoteQuoteService;

    @PostMapping
    @Operation(
            summary = "📝✍️ 독후감 + 인용구 등록",
            description = """
                    사용자가 <b>하나의 요청으로 독후감과 인용구를 동시에 등록</b>할 수 있습니다.<br><br>
                    등록된 독후감은 <code>book_reviews</code> 테이블에,<br>
                    인용구는 <code>book_quotes</code> 테이블에 각각 저장됩니다.<br><br>
                    만약 도서 정보가 없다면 <b>books 테이블에 도서가 자동 등록</b>된 후 진행됩니다.
                    """,
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "작성자 ID, 도서 ID, 독후감 내용, 인용 문장을 모두 포함합니다.",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "독후감 + 인용구 등록 예시",
                                    value = """
                                            {
                                              "userId": 1,
                                              "bookId": 101,
                                              "reviewContent": "이 책은 삶의 균형에 대해 많은 통찰을 줍니다.",
                                              "quoteContent": "모든 사람은 자신의 이야기의 주인공이다."
                                            }
                                            """
                            )
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "201", description = "✅ 독후감과 인용구 등록 성공"),
                    @ApiResponse(responseCode = "400", description = "❌ 요청 데이터 누락 또는 도서 ID 유효성 실패"),
                    @ApiResponse(responseCode = "500", description = "💥 서버 내부 오류")
            }
    )
    public ResponseEntity<BookNoteQuoteResponse> createNoteAndQuote(@RequestBody BookNoteQuoteRequest request) {
        BookNoteQuoteResponse response = bookNoteQuoteService.registerNoteAndQuote(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
