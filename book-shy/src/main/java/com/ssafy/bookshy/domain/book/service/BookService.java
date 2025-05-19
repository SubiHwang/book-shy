package com.ssafy.bookshy.domain.book.service;

import com.ssafy.bookshy.domain.book.dto.BookListResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookListTotalResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookResponseDto;
import com.ssafy.bookshy.domain.book.dto.WishRequestDto;
import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.book.entity.Wish;
import com.ssafy.bookshy.domain.book.exception.BookErrorCode;
import com.ssafy.bookshy.domain.book.exception.BookException;
import com.ssafy.bookshy.domain.book.repository.BookRepository;
import com.ssafy.bookshy.domain.book.repository.WishRepository;
import com.ssafy.bookshy.domain.library.repository.LibraryRepository;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.exception.UserErrorCode;
import com.ssafy.bookshy.domain.users.exception.UserException;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
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
    private final UserRepository userRepository;

    // 공개 여부 변경
    @Transactional
    public void updateBookStatus(Long bookId, Book.Status status) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookException(BookErrorCode.BOOK_NOT_FOUND));

        if (status == null) {
            throw new BookException(BookErrorCode.INVALID_BOOK_STATUS);
        }

        book.setStatus(status);
    }

    @Transactional
    public void addWish(Long userId, WishRequestDto dto) {
        Users user = userService.getUserById(userId);
        if (user == null) {
            throw new BookException(BookErrorCode.USER_NOT_FOUND);
        }

        Book book = bookRepository.findFirstByItemId(dto.getItemId())
                .orElseGet(() -> {
                    BookResponseDto response = aladinClient.searchByItemIdToDto(dto.getItemId());

                    if (response.getTitle() == null) {
                        throw new BookException(BookErrorCode.ITEM_ID_NOT_FOUND);
                    }

                    Book newBook;
                    try {
                        newBook = Book.builder()
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
                    } catch (Exception e) {
                        throw new BookException(BookErrorCode.BOOK_CREATE_FAILED);
                    }

                    return bookRepository.save(newBook);
                });

        if (wishRepository.existsByUserAndBook(user, book)) {
            throw new BookException(BookErrorCode.ALREADY_WISHED);
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
        if (user == null) {
            throw new BookException(BookErrorCode.USER_NOT_FOUND);
        }

        Book book = bookRepository.findFirstByItemId(itemId)
                .orElseThrow(() -> new BookException(BookErrorCode.BOOK_NOT_FOUND));

        Wish wish = wishRepository.findByUserAndBook(user, book)
                .orElseThrow(() -> new BookException(BookErrorCode.WISH_NOT_FOUND));

        wishRepository.delete(wish);
    }

    public BookListTotalResponseDto getWishList(Long userId) {
        Users user = userService.getUserById(userId);
        if (user == null) {
            throw new BookException(BookErrorCode.USER_NOT_FOUND);
        }

        List<Wish> wishList = wishRepository.findAllByUser(user);

        List<BookListResponseDto> books = wishList.stream()
                .map(wish -> {
                    Book book = wish.getBook();

                    boolean isLiked = wishRepository.existsByUserAndBook(user, book);
                    boolean inLibrary = libraryRepository.existsByUserAndBook(user, book);

                    return BookListResponseDto.from(book, isLiked, inLibrary);
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
            throw new BookException(BookErrorCode.INVALID_PUB_DATE);
        }
    }

    public boolean isBookLiked(Long userId, Book book) {
        Users user = userService.getUserById(userId);
        if (user == null) {
            throw new BookException(BookErrorCode.USER_NOT_FOUND);
        }

        return wishRepository.existsByUserAndBook(user, book);
    }

    public boolean isBookLiked(Long userId, Long itemId) {
        Users user = userService.getUserById(userId);
        if (user == null) {
            throw new BookException(BookErrorCode.USER_NOT_FOUND);
        }

        return bookRepository.findFirstByItemId(itemId)
                .map(book -> wishRepository.existsByUserAndBook(user, book))
                .orElse(false);
    }

    public boolean isBookLiked(Long userId, String isbn13) {
        Users user = userService.getUserById(userId);
        if (user == null) {
            throw new BookException(BookErrorCode.USER_NOT_FOUND);
        }

        return bookRepository.findByIsbn(isbn13)
                .map(book -> wishRepository.existsByUserAndBook(user, book))
                .orElse(false);
    }

    public BookResponseDto getBookDetailById(Long bookId, Long userId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookException(BookErrorCode.BOOK_NOT_FOUND));

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(UserErrorCode.USER_NOT_FOUND));

        boolean isLiked = wishRepository.existsByUserAndBook(user, book);

        return BookResponseDto.from(book, true, isLiked);
    }


    public boolean isInLibrary(Long userId, Long itemId) {
        return libraryRepository.existsByUserUserIdAndBookItemId(userId, itemId);
    }
}
