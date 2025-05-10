package com.ssafy.bookshy.domain.book.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.ssafy.bookshy.domain.book.dto.*;
import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.book.service.BookService;
import com.ssafy.bookshy.domain.library.entity.Library;
import com.ssafy.bookshy.domain.library.repository.LibraryRepository;
import com.ssafy.bookshy.domain.ocr.service.OcrBookSearchService;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.external.aladin.AladinClient;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    private final LibraryRepository libraryRepository;

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
    @Operation(summary = "🔍 도서 검색 목록", description = "제목, 저자, 출판사 기반으로 검색된 도서 목록을 반환합니다.")
    public ResponseEntity<BookListTotalResponseDto> searchList(
            @RequestParam String q,
            @AuthenticationPrincipal Users user
    ) {
        Long userId = user.getUserId();
        int start = 1;
        BookListTotalResponseDto response = aladinClient.searchListPreview(q, start);

        // 각 도서에 대해 찜 여부 확인
        for (BookListResponseDto dto : response.getBooks()) {
            boolean isLiked = bookService.isBookLiked(userId, dto.getItemId());
            dto.setIsLiked(isLiked);
        }

        return ResponseEntity.ok(response);
    }


    @GetMapping("/search/detail")
    @Operation(summary = "📘 도서 상세 정보", description = "itemId 기반 상세 정보를 반환합니다.")
    public ResponseEntity<BookResponseDto> searchDetail(
            @RequestParam Long itemId,
            @AuthenticationPrincipal Users user
    ) throws Exception {

        Long userId = user.getUserId();
        JsonNode node = aladinClient.searchByItemId(itemId);
        JsonNode item = node.path("item").get(0);
        boolean isLiked = bookService.isBookLiked(userId, itemId);
        return ResponseEntity.ok(BookResponseDto.fromAladin(item, isLiked));
    }

    @GetMapping("/search/isbn")
    @Operation(summary = "📘 ISBN 기반 도서 상세 검색", description = "ISBN 값으로 도서 정보를 조회합니다.")
    public ResponseEntity<BookResponseDto> searchByIsbn13(
            @RequestParam String isbn13,
            @AuthenticationPrincipal Users user
    ) {
        Long userId = user.getUserId();
        BookResponseDto dto = aladinClient.searchByIsbn13(isbn13);
        boolean isLiked = bookService.isBookLiked(userId, isbn13);
        dto.setIsLiked(isLiked);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/wish")
    @Operation(summary = "💖 읽고 싶은 책 등록", description = "도서 검색 결과에서 하트를 누르면 읽고 싶은 책으로 등록합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "등록 성공"),
            @ApiResponse(responseCode = "400", description = "중복 등록 또는 도서 정보 없음")
    })
    public ResponseEntity<Void> addWish(
            @AuthenticationPrincipal Users user,
            @RequestParam @Parameter(description = "알라딘 Item ID", example = "316294397") Long itemId
    ) {
        Long userId = user.getUserId();
        WishRequestDto dto = new WishRequestDto(itemId);
        bookService.addWish(userId, dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/wish")
    @Operation(summary = "💖🔍 읽고 싶은 책 목록 조회", description = "사용자가 읽고 싶은 책 목록을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공")
    })
    public ResponseEntity<BookListTotalResponseDto> getWishList(
            @AuthenticationPrincipal Users user) {
        Long userId = user.getUserId();
        return ResponseEntity.ok(bookService.getWishList(userId));
    }

    @DeleteMapping("/wish/remove")
    @Operation(summary = "💔 읽고 싶은 책 삭제", description = "하트를 다시 눌러 읽고 싶은 책을 삭제합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "삭제 성공"),
            @ApiResponse(responseCode = "404", description = "찜한 도서를 찾을 수 없음")
    })
    public ResponseEntity<Void> removeWish(
            @AuthenticationPrincipal Users user,
            @RequestParam @Parameter(description = "알라딘 Item ID", example = "316294397") Long itemId) {

        Long userId = user.getUserId();
        bookService.removeWish(userId, itemId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/library/detail")
    @Operation(summary = "📘 내 서재(DB)에 있는 도서 상세 정보 조회", description = "libraryId 기반으로 도서 상세 정보를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "서재 항목이 존재하지 않음")
    })
    public ResponseEntity<BookLibraryResponseDto> getBookDetailByLibraryId(
            @RequestParam Long libraryId,
            @AuthenticationPrincipal Users user
    ) {

        Long userId = user.getUserId();
        Library library = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new RuntimeException("서재 항목이 존재하지 않습니다."));
        Book book = library.getBook();

        boolean isLiked = bookService.isBookLiked(userId, book);
        return ResponseEntity.ok(BookLibraryResponseDto.from(book, library.isPublic(), isLiked));
    }

    @GetMapping("/detail")
    @Operation(
            summary = "📕 bookId 기반 도서 상세 정보 조회",
            description = "bookId를 이용해 사용자의 서재에 등록된 도서의 상세 정보를 조회합니다.",
            parameters = {
                    @Parameter(name = "bookId", description = "도서 ID", required = true, example = "42"),
                    @Parameter(name = "userId", description = "사용자 ID", required = true, example = "1")
            },
            responses = {
                    @ApiResponse(responseCode = "200", description = "📘 도서 상세 정보 반환"),
                    @ApiResponse(responseCode = "404", description = "❌ 도서를 찾을 수 없음")
            }
    )
    public ResponseEntity<BookResponseDto> getBookDetailById(
            @RequestParam Long bookId,
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(bookService.getBookDetailById(bookId, userId));
    }

}
