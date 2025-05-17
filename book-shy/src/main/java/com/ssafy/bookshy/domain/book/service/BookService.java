package com.ssafy.bookshy.domain.book.service;

import com.ssafy.bookshy.domain.book.dto.BookListResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookListTotalResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookResponseDto;
import com.ssafy.bookshy.domain.book.dto.WishRequestDto;
import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.book.entity.Wish;
import com.ssafy.bookshy.domain.book.repository.BookRepository;
import com.ssafy.bookshy.domain.book.repository.WishRepository;
import com.ssafy.bookshy.domain.library.repository.LibraryRepository;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.service.UserService;
import com.ssafy.bookshy.external.aladin.AladinClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final UserService userService;
    private final AladinClient aladinClient;
    private final WishRepository wishRepository;
    private final LibraryRepository libraryRepository;

    // 공개 여부 변경
    @Transactional
    public void updateBookStatus(Long bookId, Book.Status status) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("도서가 존재하지 않습니다."));
        book.setStatus(status);
    }

    @Transactional
    public void addWish(Long userId, WishRequestDto dto) {

        Users user = userService.getUserById(userId);
        Book book = bookRepository.findByitemId(dto.getItemId())
                .orElseGet(() -> {
                    BookResponseDto response = aladinClient.searchByItemIdToDto(dto.getItemId());
                    if (response.getTitle() == null) throw new RuntimeException("도서 정보 없음");

                    Book newBook = Book.builder()
                            .itemId(response.getItemId())
                            .isbn(response.getIsbn13())
                            .title(response.getTitle())
                            .author(response.getAuthor())
                            .publisher(response.getPublisher())
                            .pubDate(parseDate(response.getPubDate()))
                            .coverImageUrl(response.getCoverImageUrl())
                            .description(response.getDescription())
                            .category(response.getCategory())
                            .pageCount(response.getPageCount())
                            .exchangeCount(0)
                            .status(Book.Status.AVAILABLE)
                            .createdAt(LocalDateTime.now())
                            .user(user)
                            .build();

                    return bookRepository.save(newBook);
                });

        if (wishRepository.existsByUserAndBook(user, book)) {
            throw new RuntimeException("이미 찜한 도서입니다.");
        }

        Wish wish = Wish.builder()
                .user(user)
                .book(book)
                .build();

        wishRepository.save(wish);
    }

    @Transactional
    public void removeWish(Long userId, Long itemId) {

        Users user = userService.getUserById(userId);
        Book book = bookRepository.findByitemId(itemId)
                .orElseThrow(() -> new RuntimeException("도서 없음"));

        Wish wish = wishRepository.findByUserAndBook(user, book)
                .orElseThrow(() -> new RuntimeException("찜한 도서가 아닙니다."));
        wishRepository.delete(wish);
    }

    public BookListTotalResponseDto getWishList(Long userId) {
        Users user = userService.getUserById(userId);
        List<Wish> wishList = wishRepository.findAllByUser(user);

        List<BookListResponseDto> books = wishList.stream()
                .map(wish -> {
                    Book book = wish.getBook();
                    return BookListResponseDto.from(book, null, null);
                })
                .toList();

        return BookListTotalResponseDto.builder()
                .total(books.size())
                .books(books)
                .build();
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null) return null;
        try {
            return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        } catch (Exception e) {
            return null;
        }
    }

    public boolean isBookLiked(Long userId, Book book) {

        Users user = userService.getUserById(userId);
        return wishRepository.existsByUserAndBook(user, book);
    }

    public boolean isBookLiked(Long userId, Long itemId) {

        Users user = userService.getUserById(userId);
        return bookRepository.findByitemId(itemId)
                .map(book -> wishRepository.existsByUserAndBook(user, book))
                .orElse(false);
    }

    public boolean isBookLiked(Long userId, String isbn13) {

        Users user = userService.getUserById(userId);
        return bookRepository.findByIsbn(isbn13)
                .map(book -> wishRepository.existsByUserAndBook(user, book))
                .orElse(false);
    }

    /**
     * 📕 bookId를 기반으로 사용자의 서재에 있는 도서 상세 정보를 조회합니다.
     *
     * @param bookId 조회할 도서 ID
     * @param userId 현재 로그인한 사용자 ID
     * @return BookResponseDto 도서 상세 정보
     * @throws RuntimeException 도서가 존재하지 않거나 접근 권한이 없을 경우
     */
    public BookResponseDto getBookDetailById(Long bookId, Long userId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("해당 도서를 찾을 수 없습니다."));


        return BookResponseDto.from(book, true); // isPublic은 true로 고정 (또는 필요 시 추출)
    }

    public boolean isInLibrary(Long userId, Long itemId) {
        return libraryRepository.existsByUserUserIdAndBookItemId(userId, itemId);
    }
}
