package com.ssafy.bookshy.domain.book.service;

import com.ssafy.bookshy.domain.book.dto.BookListResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookListTotalResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookResponseDto;
import com.ssafy.bookshy.domain.book.dto.WishRequestDto;
import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.book.entity.Wish;
import com.ssafy.bookshy.domain.book.repository.BookRepository;
import com.ssafy.bookshy.domain.book.repository.WishRepository;
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

    // 공개 여부 변경
    @Transactional
    public void updateBookStatus(Long bookId, Book.Status status) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("도서가 존재하지 않습니다."));
        book.setStatus(status);
    }

    @Transactional
    public void addWish(WishRequestDto dto) {
        Users user = userService.getUserById(dto.getUserId());

        Book book = bookRepository.findByAladinItemId(dto.getItemId())
                .orElseGet(() -> {
                    BookResponseDto response = aladinClient.searchByItemIdToDto(dto.getItemId());
                    if (response.getTitle() == null) throw new RuntimeException("도서 정보 없음");

                    Book newBook = Book.builder()
                            .aladinItemId(dto.getItemId())
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
        Book book = bookRepository.findByAladinItemId(itemId)
                .orElseThrow(() -> new RuntimeException("도서 없음"));

        Wish wish = wishRepository.findByUserAndBook(user, book)
                .orElseThrow(() -> new RuntimeException("찜한 도서가 아닙니다."));
        wishRepository.delete(wish);
    }

    public BookListTotalResponseDto getWishList(Long userId) {
        Users user = userService.getUserById(userId);
        List<Wish> wishList = wishRepository.findAllByUser(user);

        List<BookListResponseDto> books = wishList.stream()
                .map(w -> BookListResponseDto.from(w.getBook()))
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

}
