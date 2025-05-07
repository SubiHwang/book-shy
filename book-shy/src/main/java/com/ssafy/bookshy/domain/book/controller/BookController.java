package com.ssafy.bookshy.domain.book.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.ssafy.bookshy.domain.book.dto.BookListTotalResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookSearchResponseDto;
import com.ssafy.bookshy.domain.book.dto.WishRequestDto;
import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.book.service.BookService;
import com.ssafy.bookshy.domain.ocr.service.OcrBookSearchService;
import com.ssafy.bookshy.external.aladin.AladinClient;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
    @Operation(summary = "🔍 도서 검색 목록", description = "제목 기반 검색 목록을 반환합니다.")
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

    @Operation(summary = "💖 읽고 싶은 책 등록", description = "도서 검색 결과에서 하트를 누르면 읽고 싶은 책으로 등록합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "등록 성공"),
            @ApiResponse(responseCode = "400", description = "중복 등록 또는 도서 정보 없음")
    })
    @PostMapping("/wish")
    public ResponseEntity<Void> addWish(
            @RequestParam @Parameter(description = "사용자 ID", example = "1") Long userId,
            @RequestParam @Parameter(description = "알라딘 Item ID", example = "123456789") Long itemId
    ) {
        WishRequestDto dto = new WishRequestDto(userId, itemId);
        bookService.addWish(dto);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "💖🔍 읽고 싶은 책 목록 조회 목록 조회", description = "사용자가 읽고 싶은 책 목록을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공")
    })
    @GetMapping("/wish")
    public ResponseEntity<BookListTotalResponseDto> getWishList(
            @RequestParam @Parameter(description = "사용자 ID", example = "1") Long userId) {
        return ResponseEntity.ok(bookService.getWishList(userId));
    }

    @Operation(summary = "💔 읽고 싶은 책 삭제", description = "하트를 다시 눌러 읽고 싶은 책을 삭제합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "삭제 성공"),
            @ApiResponse(responseCode = "404", description = "찜한 도서를 찾을 수 없음")
    })
    @DeleteMapping("/wish/remove")
    public ResponseEntity<Void> removeWish(
            @RequestParam @Parameter(description = "사용자 ID", example = "1") Long userId,
            @RequestParam @Parameter(description = "알라딘 Item ID", example = "123456789") Long itemId) {
        bookService.removeWish(userId, itemId);
        return ResponseEntity.ok().build();
    }
}
