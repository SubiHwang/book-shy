package com.ssafy.bookshy.domain.book.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.ssafy.bookshy.domain.book.dto.BookListTotalResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookSearchResponseDto;
import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.book.service.BookService;
import com.ssafy.bookshy.domain.ocr.service.OcrBookSearchService;
import com.ssafy.bookshy.external.aladin.AladinClient;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "📗 도서 API", description = "도서 검색 및 등록 · 상태 변경")
@RestController
@RequestMapping("/api/book")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;
    private final AladinClient aladinClient;
    private final OcrBookSearchService ocrSearchService;

    @PatchMapping("/{bookId}/status")
    @Operation(summary = "🔄 도서 상태 변경", description = "도서의 상태(AVAILABLE 등)를 변경합니다.")
    public ResponseEntity<Void> updateBookStatus(
            @PathVariable Long bookId,
            @RequestParam Book.Status status
    ) {
        bookService.updateBookStatus(bookId, status);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/search/ocr", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "❌ 표지 업로드 → 알라딘 최적 결과 [Test]")
    public BookResponseDto searchFromCover(@RequestPart("image") MultipartFile image) throws Exception {
        return ocrSearchService.search(image);
    }

    @GetMapping("/search/all")
    @Operation(summary = "❌ 모든 정보 응답하는 테스트용 api [Test]")
    public BookSearchResponseDto testAladinSearch(@RequestParam String query) {
        List<BookResponseDto> books = aladinClient.searchByKeyword(query);
        return BookSearchResponseDto.from(books);
    }

    @GetMapping("/search/list")
    @Operation(summary = "🔍 도서 검색 목록", description = "제목 기반 검색 목록을 반환합니다. (페이지네이션 지원)")
    public ResponseEntity<BookListTotalResponseDto> searchList(@RequestParam String q) {
        int start = 1;
        return ResponseEntity.ok(aladinClient.searchListPreview(q, start));
    }

    @GetMapping("/search/detail")
    @Operation(summary = "📘 도서 상세 정보", description = "itemId 기반 상세 정보를 반환합니다.")
    public ResponseEntity<BookResponseDto> searchDetail(@RequestParam Long itemId) throws Exception {
        JsonNode node = aladinClient.searchByItemId(itemId);
        JsonNode item = node.path("item").get(0);
        return ResponseEntity.ok(BookResponseDto.fromAladin(item));
    }

    @GetMapping("/search/isbn")
    @Operation(summary = "📘 ISBN 기반 도서 상세 검색", description = "ISBN 값으로 도서 정보를 조회합니다.")
    public ResponseEntity<BookResponseDto> searchByIsbn13(@RequestParam String isbn13) {
        return ResponseEntity.ok(aladinClient.searchByIsbn13(isbn13));
    }

}
