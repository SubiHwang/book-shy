package com.ssafy.bookshy.domain.library.service;

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
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.ssafy.bookshy.common.constants.ImageUrlConstants.COVER_IMAGE_BASE_URL;

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

    @Value("${file.upload-dir}")
    private String uploadPath;

    /**
     * 📘 ISBN을 기반으로 도서를 조회하고, 존재하지 않을 경우 Aladin API를 통해 신규 등록 후 서재에 추가합니다.
     *
     * @param userId   사용자 ID
     * @param isbn13   도서의 ISBN13
     * @param isPublic 공개 여부 (null일 경우 false로 처리)
     * @return 등록된 도서의 LibraryResponseDto
     */
    @Transactional
    public LibraryResponseDto registerByIsbn(Long userId, String isbn13, Boolean isPublic) {
        Users user = userService.getUserById(userId);

        Book book = bookRepository.findByUserAndIsbn(user, isbn13).orElseGet(() -> {
            BookResponseDto response = aladinClient.searchByIsbn13(isbn13);

//            if (response.getTitle() == null) {
//                throw new GlobalException(GlobalErrorCode.RESOURCE_NOT_FOUND);
//            }

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

//        if (libraryRepository.existsByUserAndBook(user, book)) {
//            throw new GlobalException(GlobalErrorCode.INVALID_INPUT_VALUE);
//        }

        wishRepository.deleteByUserAndBook(user, book);

        Library library = Library.builder()
                .user(user)
                .book(book)
                .isPublic(isPublic != null && isPublic)
                .registeredAt(LocalDateTime.now())
                .build();

        return LibraryResponseDto.from(libraryRepository.save(library));
    }

    /**
     * ❌ 서재에서 특정 도서(libraryId)를 제거합니다.
     *
     * @param libraryId 서재 ID
     * @throws GlobalException 해당 ID가 존재하지 않을 경우 예외 발생
     */
    @Transactional
    public void removeFromLibrary(Long libraryId) {
//        if (!libraryRepository.existsById(libraryId)) {
//            throw new GlobalException(GlobalErrorCode.RESOURCE_NOT_FOUND);
//        }
        libraryRepository.deleteById(libraryId);
    }

    /**
     * 🔄 서재 도서의 공개 여부를 설정합니다.
     *
     * @param libraryId 서재 ID
     * @param isPublic  true: 공개, false: 비공개
     * @throws GlobalException 해당 서재 ID가 존재하지 않을 경우 예외 발생
     */
    @Transactional
    public void setPublic(Long libraryId, boolean isPublic) {
        Library library = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new RuntimeException());
        library.setPublic(isPublic);
    }

    /**
     * 📗 사용자의 전체 서재 목록을 반환합니다. 최신 등록 순으로 정렬됩니다.
     *
     * @param userId 사용자 ID
     * @return LibraryResponseDto 리스트
     */
    public List<LibraryResponseDto> findLibraryByUser(Long userId) {
        Users user = userService.getUserById(userId);
        return libraryRepository.findAllByUserOrderByRegisteredAtDesc(user)
                .stream()
                .map(LibraryResponseDto::from)
                .toList();
    }

    /**
     * 📗 사용자의 공개된 서재 목록만 반환합니다.
     *
     * @param userId 사용자 ID
     * @return 공개된 LibraryResponseDto 리스트
     */
    public List<LibraryResponseDto> findPublicLibraryByUser(Long userId) {
        Users user = userService.getUserById(userId);
        return libraryRepository.findByUserAndIsPublicTrueOrderByRegisteredAtDesc(user)
                .stream()
                .map(LibraryResponseDto::from)
                .toList();
    }

    /**
     * 📊 사용자 서재 통계를 반환합니다. 전체 도서 수와 공개 도서 수를 포함합니다.
     *
     * @param userId 사용자 ID
     * @return Map<String, Long> - key: total/public
     */
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

    /**
     * ➕ 검색 기반 도서를 서재에 추가합니다. (Aladin 검색 결과 기반)
     *
     * @param dto 검색 추가 요청 DTO
     * @return 등록된 도서의 LibraryResponseDto
     * @throws RuntimeException 도서 정보가 없거나 중복 등록된 경우
     */
    @Transactional
    public LibraryResponseDto addBookFromSearch(LibrarySearchAddRequestDto dto) {
        Users user = userService.getUserById(dto.getUserId());

        // 이미 존재하는 도서인지 확인
        Book book = bookRepository.findByitemId(dto.getItemId())
                .orElseGet(() -> {
                    BookResponseDto response = aladinClient.searchByItemIdToDto(dto.getItemId());

                    if (response.getTitle() == null) {
                        throw new RuntimeException("도서 정보를 찾을 수 없습니다.");
                    }

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

        // 이미 등록된 도서인지 확인
        if (libraryRepository.existsByUserAndBook(user, book)) {
            throw new RuntimeException("이미 서재에 등록된 도서입니다.");
        }

        wishRepository.deleteByUserAndBook(user, book);

        Library library = Library.builder()
                .user(user)
                .book(book)
                .isPublic(false)
                .registeredAt(LocalDateTime.now())
                .build();

        libraryRepository.save(library);
        return LibraryResponseDto.from(library);
    }

    /**
     * ✍ 사용자가 직접 입력한 도서 정보를 바탕으로 도서를 등록하고 서재에 추가합니다.
     *
     * @param dto 직접 등록 요청 DTO (제목, 저자, 출판사, 이미지 포함)
     * @return 등록된 도서의 LibraryResponseDto
     * @throws RuntimeException 표지 이미지 저장 실패 시 발생
     */
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

        wishRepository.deleteByUserAndBook(user, book);

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

    /**
     * 📚 사용자의 전체 서재 목록을 조회하고 각 도서에 대해 여정(BookTrip) 작성 여부를 포함해 반환합니다.
     * <p>
     * ✅ 동작 흐름:
     * - 사용자의 전체 서재 목록을 조회
     * - 해당 사용자가 작성한 BookTrip 엔티티를 모두 조회 후 bookId만 추출
     * - 각 서재 항목에 대해 해당 bookId가 여정에 포함되어 있는지를 판단해 hasTrip 필드에 반영
     * <p>
     * ✅ 반환 정보:
     * - libraryId, bookId, isbn13, title, author, coverImageUrl, public 여부, hasTrip 여부 포함
     *
     * @param userId 로그인 사용자 ID
     * @return LibraryWithTripResponseDto 리스트
     */
    @Transactional(readOnly = true)
    public List<LibraryWithTripResponseDto> findLibraryWithTripStatus(Long userId) {
        Users user = userService.getUserById(userId);
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
