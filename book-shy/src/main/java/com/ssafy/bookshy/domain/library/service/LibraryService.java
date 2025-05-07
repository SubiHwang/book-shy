package com.ssafy.bookshy.domain.library.service;

import com.ssafy.bookshy.common.exception.GlobalErrorCode;
import com.ssafy.bookshy.common.exception.GlobalException;
import com.ssafy.bookshy.domain.book.dto.BookResponseDto;
import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.book.repository.BookRepository;
import com.ssafy.bookshy.domain.library.dto.LibraryResponseDto;
import com.ssafy.bookshy.domain.library.dto.LibrarySearchAddRequestDto;
import com.ssafy.bookshy.domain.library.dto.LibrarySelfAddRequestDto;
import com.ssafy.bookshy.domain.library.entity.Library;
import com.ssafy.bookshy.domain.library.repository.LibraryRepository;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.service.UserService;
import com.ssafy.bookshy.external.aladin.AladinClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;

import static com.ssafy.bookshy.common.constants.ImageUrlConstants.COVER_IMAGE_BASE_URL;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LibraryService {

    private final LibraryRepository libraryRepository;
    private final BookRepository bookRepository;
    private final UserService userService;
    private final AladinClient aladinClient;

    @Value("${file.upload-dir}")
    private String uploadPath;

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

    @Transactional
    public LibraryResponseDto addBookFromSearch(LibrarySearchAddRequestDto dto) {
        Users user = userService.getUserById(dto.getUserId());

        // 이미 존재하는 도서인지 확인
        Book book = bookRepository.findByAladinItemId(dto.getItemId())
                .orElseGet(() -> {
                    BookResponseDto response = aladinClient.searchByItemIdToDto(dto.getItemId());

                    if (response.getTitle() == null) {
                        throw new RuntimeException("도서 정보를 찾을 수 없습니다.");
                    }

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

        // 이미 등록된 도서인지 확인
        if (libraryRepository.existsByUserAndBook(user, book)) {
            throw new RuntimeException("이미 서재에 등록된 도서입니다.");
        }

        Library library = Library.builder()
                .user(user)
                .book(book)
                .isPublic(false)
                .registeredAt(LocalDateTime.now())
                .build();

        libraryRepository.save(library);
        return LibraryResponseDto.from(library);
    }

    @Transactional
    public LibraryResponseDto addSelfBook(LibrarySelfAddRequestDto dto) {
        Users user = userService.getUserById(dto.getUserId());

        // 1. 이미지 파일 저장
        String fileName = UUID.randomUUID() + "_" + dto.getCoverImage().getOriginalFilename();
        String savePath = uploadPath + "/" + fileName;
        File dest = new File(savePath);

        try {
            dto.getCoverImage().transferTo(dest);
        } catch (IOException e) {
            throw new RuntimeException("표지 이미지 저장 실패: " + e.getMessage());
        }

        // 2. Book 엔티티 생성
        Book book = Book.builder()
                .isbn("SELF_" + UUID.randomUUID())  // 자체 등록 도서는 ISBN 대신 UUID 사용
                .title(dto.getTitle())
                .author(dto.getAuthor())
                .publisher(dto.getPublisher())
                .description(dto.getDescription())
                .coverImageUrl(COVER_IMAGE_BASE_URL + fileName)
                .status(Book.Status.AVAILABLE)
                .exchangeCount(0)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        bookRepository.save(book);

        // 3. Library 등록
        Library library = Library.builder()
                .user(user)
                .book(book)
                .isPublic(dto.isPublic())
                .registeredAt(LocalDateTime.now())
                .build();

        libraryRepository.save(library);

        return LibraryResponseDto.from(library);
    }

}
