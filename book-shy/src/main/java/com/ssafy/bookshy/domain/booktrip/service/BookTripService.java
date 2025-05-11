package com.ssafy.bookshy.domain.booktrip.service;

import com.ssafy.bookshy.domain.booktrip.entity.BookTrip;
import com.ssafy.bookshy.domain.booktrip.dto.*;
import com.ssafy.bookshy.domain.booktrip.repository.BookTripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookTripService {
    private final BookTripRepository bookTripRepository;

    /**
     * 📖 특정 도서 ID에 대한 여정 목록을 조회합니다.
     * @param bookId 도서 ID
     * @return BookTripDto 리스트
     */
    @Transactional(readOnly = true)
    public List<BookTripDto> getTripsByBookId(Long bookId) {
        return bookTripRepository.findByBookId(bookId).stream()
                .map(BookTripDto::from)
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
}