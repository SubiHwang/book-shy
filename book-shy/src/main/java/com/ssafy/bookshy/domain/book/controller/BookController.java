package com.ssafy.bookshy.domain.book.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.ssafy.bookshy.common.response.CommonResponse;
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
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

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
    public CommonResponse<Void> updateBookStatus(
            @PathVariable Long bookId,
            @RequestParam Book.Status status
    ) {
        bookService.updateBookStatus(bookId, status);
        return CommonResponse.success();
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
    @Operation(
            summary = "🔍 도서 검색 목록",
            description = """
                        🔒 <b>로그인 사용자</b>의 인증 정보를 기반으로 검색된 도서에 대해 찜 여부를 포함하여 응답합니다.<br>
                        - `q`는 검색 키워드입니다.
                    """,
            parameters = {
                    @Parameter(name = "q", description = "🔍 검색어", required = true, example = "총 균 쇠")
            }
    )
    public CommonResponse<BookListTotalResponseDto> searchList(
            @RequestParam String q,
            @AuthenticationPrincipal Users user
    ) {
        BookListTotalResponseDto response = aladinClient.searchListPreview(q, 1);

        for (BookListResponseDto dto : response.getBooks()) {
            boolean isLiked = bookService.isBookLiked(user.getUserId(), dto.getItemId());
            boolean inLibrary = bookService.isInLibrary(user.getUserId(), dto.getItemId());

            dto.setIsLiked(isLiked);
            dto.setInLibrary(inLibrary);
        }

        return CommonResponse.success(response);
    }

    @GetMapping("/search/detail")
    @Operation(
            summary = "📘 도서 상세 정보 (알라딘)",
            description = """
                        🔒 <b>로그인 사용자</b>의 인증 정보를 기반으로, 알라딘 API에서 도서 상세 정보를 조회합니다.<br>
                        - `itemId`는 알라딘의 도서 고유 ID입니다.
                    """,
            parameters = {
                    @Parameter(name = "itemId", description = "📚 알라딘 도서 고유 ID", required = true, example = "321118369")
            }
    )
    public CommonResponse<BookResponseDto> searchDetail(
            @RequestParam Long itemId,
            @AuthenticationPrincipal Users user
    ) throws Exception {
        JsonNode node = aladinClient.searchByItemId(itemId);
        JsonNode item = node.path("item").get(0);
        boolean isLiked = bookService.isBookLiked(user.getUserId(), itemId);
        return CommonResponse.success(BookResponseDto.fromAladin(item, isLiked));
    }

    @GetMapping("/search/isbn")
    @Operation(
            summary = "📘 ISBN 기반 도서 상세 검색",
            description = """
                        🔒 <b>로그인 사용자</b>의 인증 정보를 기반으로, ISBN 값으로 도서 정보를 조회합니다.
                    """,
            parameters = {
                    @Parameter(name = "isbn13", description = "📖 ISBN-13", required = true, example = "9788934951711")
            }
    )
    public CommonResponse<BookResponseDto> searchByIsbn13(
            @RequestParam String isbn13,
            @AuthenticationPrincipal Users user
    ) {
        BookResponseDto dto = aladinClient.searchByIsbn13(isbn13);
        boolean isLiked = bookService.isBookLiked(user.getUserId(), isbn13);
        dto.setIsLiked(isLiked);
        return CommonResponse.success(dto);
    }

    @PostMapping("/wish")
    @Operation(
            summary = "💖 읽고 싶은 책 등록",
            description = """
                        🔒 <b>로그인 사용자</b>의 인증 정보를 기반으로 도서를 찜합니다.<br>
                        - 이미 찜한 도서인 경우 400 오류를 반환합니다.
                    """,
            parameters = {
                    @Parameter(name = "itemId", description = "📚 알라딘 Item ID", required = true, example = "123456789")
            }
    )
    public CommonResponse<Void> addWish(
            @RequestParam Long itemId,
            @AuthenticationPrincipal Users user
    ) {
        bookService.addWish(user.getUserId(), new WishRequestDto(itemId));
        return CommonResponse.success();
    }

    @GetMapping("/wish")
    @Operation(
            summary = "💖🔍 읽고 싶은 책 목록 조회",
            description = """
                        🔒 <b>로그인 사용자</b>의 인증 정보를 기반으로 찜한 도서 목록을 조회합니다.
                    """
    )
    public CommonResponse<BookListTotalResponseDto> getWishList(
            @AuthenticationPrincipal Users user
    ) {
        return CommonResponse.success(bookService.getWishList(user.getUserId()));
    }

    @DeleteMapping("/wish/remove")
    @Operation(
            summary = "💔 읽고 싶은 책 삭제",
            description = """
                        🔒 <b>로그인 사용자</b>의 인증 정보를 기반으로 찜한 도서를 삭제합니다.
                    """,
            parameters = {
                    @Parameter(name = "itemId", description = "📚 알라딘 Item ID", required = true, example = "123456789")
            }
    )
    public CommonResponse<Void> removeWish(
            @RequestParam Long itemId,
            @AuthenticationPrincipal Users user
    ) {
        bookService.removeWish(user.getUserId(), itemId);
        return CommonResponse.success();
    }

    @GetMapping("/library/detail")
    @Operation(
            summary = "📘 내 서재 도서 상세 조회",
            description = """
                        🔒 <b>로그인 사용자</b>의 인증 정보를 기반으로 서재에 등록된 도서 정보를 조회합니다.
                    """,
            parameters = {
                    @Parameter(name = "libraryId", description = "📚 서재 항목 ID", required = true, example = "101")
            }
    )
    public CommonResponse<BookLibraryResponseDto> getBookDetailByLibraryId(
            @RequestParam Long libraryId,
            @AuthenticationPrincipal Users user
    ) {
        Library library = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "서재 항목이 존재하지 않습니다."));
        Book book = library.getBook();
        boolean isLiked = bookService.isBookLiked(user.getUserId(), book);
        return CommonResponse.success(BookLibraryResponseDto.from(book, library.isPublic(), isLiked));
    }

    @GetMapping("/detail")
    @Operation(
            summary = "📕 bookId 기반 도서 상세 정보 조회",
            description = """
                        🔒 <b>로그인 사용자</b>의 인증 정보를 기반으로 도서 상세 정보를 조회합니다.<br>
                        - `bookId`는 DB에 저장된 도서의 기본 키입니다.
                    """,
            parameters = {
                    @Parameter(name = "bookId", description = "📚 도서 ID", required = true, example = "42")
            }
    )
    public CommonResponse<BookResponseDto> getBookDetailById(
            @RequestParam Long bookId,
            @AuthenticationPrincipal Users user
    ) {
        return CommonResponse.success(bookService.getBookDetailById(bookId, user.getUserId()));
    }
}
