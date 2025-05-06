package com.ssafy.bookshy.domain.library.service;

import com.ssafy.bookshy.common.exception.GlobalErrorCode;
import com.ssafy.bookshy.common.exception.GlobalException;
import com.ssafy.bookshy.domain.book.dto.BookResponseDto;
import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.book.repository.BookRepository;
import com.ssafy.bookshy.domain.library.dto.LibraryResponseDto;
import com.ssafy.bookshy.domain.library.entity.Library;
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
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LibraryService {

    private final LibraryRepository libraryRepository;
    private final BookRepository bookRepository;
    private final UserService userService;
    private final AladinClient aladinClient;

    @Transactional
    public LibraryResponseDto registerByIsbn(Long userId, String isbn13, Boolean isPublic) {
        Users user = userService.getUserById(userId);

        Book book = bookRepository.findByUserAndIsbn(user, isbn13).orElseGet(() -> {
            BookResponseDto response = aladinClient.searchByIsbn13(isbn13);

            if (response.getTitle() == null) {
                throw new GlobalException(GlobalErrorCode.RESOURCE_NOT_FOUND);
            }

            Book newBook = Book.builder()
                    .aladinItemId(Long.parseLong(response.getIsbn13()))
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

        if (libraryRepository.existsByUserAndBook(user, book)) {
            throw new GlobalException(GlobalErrorCode.INVALID_INPUT_VALUE);
        }

        Library library = Library.builder()
                .user(user)
                .book(book)
                .isPublic(isPublic != null && isPublic)
                .registeredAt(LocalDateTime.now())
                .build();

        return LibraryResponseDto.from(libraryRepository.save(library));
    }

    @Transactional
    public void removeFromLibrary(Long libraryId) {
        if (!libraryRepository.existsById(libraryId)) {
            throw new GlobalException(GlobalErrorCode.RESOURCE_NOT_FOUND);
        }
        libraryRepository.deleteById(libraryId);
    }

    @Transactional
    public void setPublic(Long libraryId, boolean isPublic) {
        Library library = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new GlobalException(GlobalErrorCode.RESOURCE_NOT_FOUND));
        library.setPublic(isPublic);
    }

    public List<LibraryResponseDto> findLibraryByUser(Long userId) {
        Users user = userService.getUserById(userId);
        return libraryRepository.findByUser(user).stream()
                .map(LibraryResponseDto::from)
                .toList();
    }

    public List<LibraryResponseDto> findPublicLibraryByUser(Long userId) {
        Users user = userService.getUserById(userId);
        return libraryRepository.findByUserAndIsPublicTrue(user).stream()
                .map(LibraryResponseDto::from)
                .toList();
    }

    public Map<String, Long> countLibrary(Long userId) {
        Users user = userService.getUserById(userId);
        long total = libraryRepository.countByUser(user);
        long publicCount = libraryRepository.countByUserAndIsPublicTrue(user);
        return Map.of("total", total, "public", publicCount);
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
