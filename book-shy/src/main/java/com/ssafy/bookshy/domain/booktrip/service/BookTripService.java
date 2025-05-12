package com.ssafy.bookshy.domain.booktrip.service;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.book.repository.BookRepository;
import com.ssafy.bookshy.domain.booktrip.entity.BookTrip;
import com.ssafy.bookshy.domain.booktrip.dto.*;
import com.ssafy.bookshy.domain.booktrip.repository.BookTripRepository;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookTripService {
    private final BookTripRepository bookTripRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    /**
     * 📖 특정 도서 ID에 대한 여정 목록을 조회합니다.
     * @param bookId 도서 ID
     * @return BookTripDto 리스트
     */
    @Transactional(readOnly = true)
    public List<BookTripWithUserDto> getTripsWithUser(Long bookId, Users loginUser) {
        Long loginUserId = loginUser.getUserId();
        return bookTripRepository.findByBookId(bookId).stream()
                .map(trip -> {
                    var user = userRepository.findById(trip.getUserId())
                            .orElseThrow(() -> new IllegalArgumentException("USER_NOT_FOUND"));
                    boolean isMine = trip.getUserId().equals(loginUserId);
                    return BookTripWithUserDto.from(trip, isMine, user.getNickname(), user.getProfileImageUrl());
                })
                .collect(Collectors.toList());
    }


    /**
     * 📝 책의 여정 등록
     * @param userId 사용자 ID (작성자)
     * @param req 여정 등록 요청 객체 (도서 ID, 내용 포함)
     * @return 생성된 BookTripDto 객체
     */
    @Transactional
    public BookTripDto createTrip(Long userId, CreateBookTripRequest req) {
        BookTrip trip = BookTrip.builder()
                .bookId(req.getBookId())
                .userId(userId)
                .content(req.getContent())
                .build();
        return BookTripDto.from(bookTripRepository.save(trip));
    }

    /**
     * ✏️ 책의 여정 수정
     * @param userId 사용자 ID (작성자 확인용)
     * @param tripId 수정할 여정 ID
     * @param req 수정 요청 객체 (내용 포함)
     * @return 수정된 BookTripDto 객체
     * @throws IllegalArgumentException 여정 ID가 존재하지 않을 경우
     * @throws SecurityException 작성자가 아닐 경우
     */
    @Transactional
    public BookTripDto updateTrip(Long userId, Long tripId, UpdateBookTripRequest req) {
        BookTrip trip = bookTripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("BOOK_TRIP_NOT_FOUND"));
        if (!trip.getUserId().equals(userId)) throw new SecurityException("FORBIDDEN_USER");
        trip.updateContent(req.getContent());
        return BookTripDto.from(trip);
    }

    /**
     * ❌ 책의 여정 삭제
     * @param userId 사용자 ID (작성자 확인용)
     * @param tripId 삭제할 여정 ID
     * @throws IllegalArgumentException 여정 ID가 존재하지 않을 경우
     * @throws SecurityException 작성자가 아닐 경우
     */
    @Transactional
    public void deleteTrip(Long userId, Long tripId) {
        BookTrip trip = bookTripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("BOOK_TRIP_NOT_FOUND"));
        if (!trip.getUserId().equals(userId)) throw new SecurityException("FORBIDDEN_USER");
        bookTripRepository.delete(trip);
    }

    /**
     * 📘 서재에 없는 나의 책 여정 목록 조회
     *
     * - 사용자가 작성한 여정 중 자신의 서재에 없는 도서(Book)에 대한 여정만 조회합니다.
     * - Repository에서 직접 필터링된 결과를 가져오므로 성능이 향상됩니다.
     *
     * @param loginUser 현재 로그인한 사용자
     * @return BookTripBookItemDto 리스트 (isMine은 항상 true)
     */
    @Transactional(readOnly = true)
    public List<BookTripBookItemDto> getTripsNotInMyLibraryWithBookInfo(Users loginUser) {
        Long userId = loginUser.getUserId();
        List<BookTrip> trips = bookTripRepository.findMyTripsNotInMyLibrary(userId);

        // 도서 ID만 추출
        Set<Long> bookIds = trips.stream()
                .map(BookTrip::getBookId)
                .collect(Collectors.toSet());

        // 도서 정보 조회 (in 쿼리로 한 번에 조회)
        Map<Long, Book> bookMap = bookRepository.findAllById(bookIds).stream()
                .collect(Collectors.toMap(Book::getId, b -> b));

        // 응답 DTO로 변환
        return trips.stream()
                .map(trip -> BookTripBookItemDto.from(
                        trip,
                        bookMap.get(trip.getBookId()),
                        loginUser.getNickname(),
                        loginUser.getProfileImageUrl()))
                .toList();
    }


}