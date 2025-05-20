package com.ssafy.bookshy.domain.library.service;

import com.ssafy.bookshy.common.constants.ImageUrlConstants;
import com.ssafy.bookshy.common.file.FileUploadUtil;
import com.ssafy.bookshy.domain.book.dto.BookResponseDto;
import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.book.repository.BookRepository;
import com.ssafy.bookshy.domain.book.repository.WishRepository;
import com.ssafy.bookshy.domain.booknote.entity.BookNote;
import com.ssafy.bookshy.domain.booknote.repository.BookNoteRepository;
import com.ssafy.bookshy.domain.booktrip.entity.BookTrip;
import com.ssafy.bookshy.domain.booktrip.repository.BookTripRepository;
import com.ssafy.bookshy.domain.library.dto.LibraryResponseDto;
import com.ssafy.bookshy.domain.library.dto.LibrarySearchAddRequestDto;
import com.ssafy.bookshy.domain.library.dto.LibrarySelfAddRequestDto;
import com.ssafy.bookshy.domain.library.dto.LibraryWithTripResponseDto;
import com.ssafy.bookshy.domain.library.entity.Library;
import com.ssafy.bookshy.domain.library.entity.LibraryReadLog;
import com.ssafy.bookshy.domain.library.exception.LibraryErrorCode;
import com.ssafy.bookshy.domain.library.exception.LibraryException;
import com.ssafy.bookshy.domain.library.repository.LibraryReadLogRepository;
import com.ssafy.bookshy.domain.library.repository.LibraryRepository;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.service.UserService;
import com.ssafy.bookshy.external.aladin.AladinClient;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static com.ssafy.bookshy.common.constants.ImageUrlConstants.COVER_IMAGE_BASE_URL;

// 생략된 import 문은 동일

@Service
@RequiredArgsConstructor
public class LibraryService {

    private final LibraryRepository libraryRepository;
    private final BookRepository bookRepository;
    private final UserService userService;
    private final AladinClient aladinClient;
    private final WishRepository wishRepository;
    private final BookNoteRepository bookNoteRepository;
    private final BookTripRepository bookTripRepository;
    private final LibraryReadLogRepository libraryReadLogRepository;

    @Value("${file.upload-dir}")
    private String uploadPath;

    @Transactional
    public LibraryResponseDto registerByIsbn(Long userId, String isbn13, Boolean isPublic) {
        Users user = userService.getUserById(userId);
        if (user == null) throw new LibraryException(LibraryErrorCode.USER_NOT_FOUND);

        Book book = bookRepository.findByUserAndIsbn(user, isbn13).orElseGet(() -> {
            BookResponseDto response = aladinClient.searchByIsbn13(isbn13);
            if (response.getTitle() == null) {
                throw new LibraryException(LibraryErrorCode.ITEM_ID_NOT_FOUND);
            }

            try {
                return bookRepository.save(Book.builder()
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
                        .build());
            } catch (Exception e) {
                throw new LibraryException(LibraryErrorCode.BOOK_CREATE_FAILED);
            }
        });

        if (libraryRepository.existsByUserAndBook(user, book)) {
            throw new LibraryException(LibraryErrorCode.DUPLICATE_LIBRARY_ENTRY);
        }

        wishRepository.deleteByUserAndBook(user, book);

        Library library = Library.builder()
                .user(user)
                .book(book)
                .isPublic(isPublic != null && isPublic)
                .registeredAt(LocalDateTime.now())
                .build();

        Library saved = libraryRepository.save(library);

        // 누적 독서 로그 기록
        if (!libraryReadLogRepository.existsByUserIdAndBookId(user.getUserId(), book.getId())) {
            libraryReadLogRepository.save(
                    LibraryReadLog.builder()
                            .userId(user.getUserId())
                            .bookId(book.getId())
                            .registeredAt(LocalDateTime.now())
                            .build()
            );
        }

        return LibraryResponseDto.from(saved);
    }

    @Transactional
    public LibraryResponseDto addBookFromSearch(LibrarySearchAddRequestDto dto) {
        Users user = userService.getUserById(dto.getUserId());
        if (user == null) throw new LibraryException(LibraryErrorCode.USER_NOT_FOUND);

        Book book = bookRepository.findFirstByItemId(dto.getItemId())
                .orElseGet(() -> {
                    BookResponseDto response = aladinClient.searchByItemIdToDto(dto.getItemId());

                    if (response.getTitle() == null) {
                        throw new LibraryException(LibraryErrorCode.ITEM_ID_NOT_FOUND);
                    }

                    return bookRepository.save(Book.builder()
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
                            .build());
                });

        if (libraryRepository.existsByUserAndBook(user, book)) {
            throw new LibraryException(LibraryErrorCode.DUPLICATE_LIBRARY_ENTRY);
        }

        wishRepository.deleteByUserAndBook(user, book);

        Library library = Library.builder()
                .user(user)
                .book(book)
                .isPublic(false)
                .registeredAt(LocalDateTime.now())
                .build();

        Library saved = libraryRepository.save(library);

        // 누적 독서 로그 기록
        if (!libraryReadLogRepository.existsByUserIdAndBookId(user.getUserId(), book.getId())) {
            libraryReadLogRepository.save(
                    LibraryReadLog.builder()
                            .userId(user.getUserId())
                            .bookId(book.getId())
                            .registeredAt(LocalDateTime.now())
                            .build()
            );
        }

        return LibraryResponseDto.from(saved);
    }

    @Transactional
    public LibraryResponseDto addSelfBook(LibrarySelfAddRequestDto dto) {
        Users user = userService.getUserById(dto.getUserId());
        if (user == null) throw new LibraryException(LibraryErrorCode.USER_NOT_FOUND);


        // 1️⃣ 파일 이름 및 저장 경로
        String fileName = UUID.randomUUID() + "_" + dto.getCoverImage().getOriginalFilename();
        String uploadDir = "/home/ubuntu/bookshy/images/coverImage";  // 또는 @Value 주입
        String imageUrl = ImageUrlConstants.COVER_IMAGE_BASE_URL + fileName;

        // 2️⃣ 공통 유틸로 이미지 저장
        FileUploadUtil.saveFile(dto.getCoverImage(), uploadDir, fileName);

        // 3️⃣ Book 생성
        Book book = Book.builder()
                .isbn("SELF_" + UUID.randomUUID())
                .title(dto.getTitle())
                .author(dto.getAuthor())
                .publisher(dto.getPublisher())
                .description(dto.getDescription())
                .coverImageUrl(imageUrl)
                .status(Book.Status.AVAILABLE)
                .exchangeCount(0)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        bookRepository.save(book);
        wishRepository.deleteByUserAndBook(user, book);

        // 4️⃣ Library 등록
        Library library = Library.builder()
                .user(user)
                .book(book)
                .isPublic(dto.isPublic())
                .registeredAt(LocalDateTime.now())
                .build();

        Library saved = libraryRepository.save(library);

        // 누적 독서 로그 기록
        if (!libraryReadLogRepository.existsByUserIdAndBookId(user.getUserId(), book.getId())) {
            libraryReadLogRepository.save(
                    LibraryReadLog.builder()
                            .userId(user.getUserId())
                            .bookId(book.getId())
                            .registeredAt(LocalDateTime.now())
                            .build()
            );
        }

        return LibraryResponseDto.from(saved);
    }

    @Transactional
    public void removeFromLibrary(Long libraryId) {
        if (!libraryRepository.existsById(libraryId)) {
            throw new LibraryException(LibraryErrorCode.LIBRARY_NOT_FOUND);
        }
        libraryRepository.deleteById(libraryId);
    }

    @Transactional
    public void setPublic(Long libraryId, boolean isPublic) {
        Library library = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new LibraryException(LibraryErrorCode.LIBRARY_NOT_FOUND));
        library.setPublic(isPublic);
    }

    public List<LibraryResponseDto> findLibraryByUser(Long userId) {
        Users user = userService.getUserById(userId);
        if (user == null) throw new LibraryException(LibraryErrorCode.USER_NOT_FOUND);

        return libraryRepository.findAllByUserOrderByRegisteredAtDesc(user)
                .stream()
                .map(LibraryResponseDto::from)
                .toList();
    }

    public List<LibraryResponseDto> findPublicLibraryByUser(Long userId) {
        Users user = userService.getUserById(userId);
        if (user == null) throw new LibraryException(LibraryErrorCode.USER_NOT_FOUND);

        return libraryRepository.findByUserAndIsPublicTrueOrderByRegisteredAtDesc(user)
                .stream()
                .map(LibraryResponseDto::from)
                .toList();
    }

    public Map<String, Long> countLibrary(Long userId) {
        Users user = userService.getUserById(userId);
        if (user == null) throw new LibraryException(LibraryErrorCode.USER_NOT_FOUND);

        long total = libraryRepository.countByUser(user);
        long publicCount = libraryRepository.countByUserAndIsPublicTrue(user);
        return Map.of("total", total, "public", publicCount);
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null) return null;
        try {
            return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        } catch (Exception e) {
            throw new LibraryException(LibraryErrorCode.INVALID_PUB_DATE);
        }
    }

    /**
     * 📘✏️ 사용자의 서재 중 아직 독후감이 작성되지 않은 도서 목록을 반환합니다.
     * <p>
     * - 모든 서재 항목을 조회
     * - 각 항목의 bookId가 book_reviews 테이블(BookNote)에 존재하지 않는 경우만 필터링
     * - 책의 상세 정보(title, author, cover 등)와 함께 DTO로 반환
     */
    @Transactional(readOnly = true)
    public List<LibraryResponseDto> findUnwrittenNotesByUserId(Long userId) {
        Users user = userService.getUserById(userId);
        if (user == null) throw new LibraryException(LibraryErrorCode.USER_NOT_FOUND);

        List<Library> libraries = libraryRepository.findByUser(user);
        Set<Long> writtenBookIds = bookNoteRepository.findAll().stream()
                .filter(note -> note.getUserId().equals(userId))
                .map(BookNote::getBookId)
                .collect(Collectors.toSet());

        return libraries.stream()
                .filter(lib -> !writtenBookIds.contains(lib.getBook().getId()))
                .map(LibraryResponseDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LibraryWithTripResponseDto> findLibraryWithTripStatus(Long userId) {
        Users user = userService.getUserById(userId);
        if (user == null) throw new LibraryException(LibraryErrorCode.USER_NOT_FOUND);

        List<Library> libraries = libraryRepository.findAllByUserOrderByRegisteredAtDesc(user);

        Set<Long> tripBookIds = bookTripRepository.findAll().stream()
                .filter(trip -> trip.getUserId().equals(userId))
                .map(BookTrip::getBookId)
                .collect(Collectors.toSet());

        return libraries.stream()
                .map(lib -> LibraryWithTripResponseDto.from(lib, tripBookIds.contains(lib.getBook().getId())))
                .toList();
    }
}
