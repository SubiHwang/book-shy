package com.ssafy.bookshy.domain.exchange.service;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.chat.entity.ChatCalendar;
import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.chat.repository.ChatCalendarRepository;
import com.ssafy.bookshy.domain.chat.repository.ChatRoomRepository;
import com.ssafy.bookshy.domain.exchange.dto.ExchangeRequestDto;
import com.ssafy.bookshy.domain.exchange.dto.ReviewSubmitRequest;
import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequest;
import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequestReview;
import com.ssafy.bookshy.domain.exchange.repository.ExchangeRequestRepository;
import com.ssafy.bookshy.domain.exchange.repository.ExchangeRequestReviewRepository;
import com.ssafy.bookshy.domain.library.entity.Library;
import com.ssafy.bookshy.domain.library.repository.LibraryRepository;
import com.ssafy.bookshy.domain.users.entity.Users;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ExchangeService {

    private final ExchangeRequestRepository exchangeRequestRepository;
    private final ExchangeRequestReviewRepository reviewRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatCalendarRepository chatCalendarRepository;
    private final LibraryRepository libraryRepository;

    /**
     * 📩 도서 교환 요청 처리 메서드
     * - 교환 요청을 저장하고, 연결된 약속 캘린더(chat_calendar)도 함께 등록합니다.
     * - 트랜잭션으로 묶어 일관성 보장
     * @param dto 사용자의 교환 요청 정보
     */
    @Transactional
    public void requestExchange(ExchangeRequestDto dto) {
        validateDuplicate(dto);

        // 1. 교환 요청 저장
        ExchangeRequest request = ExchangeRequest.builder()
                .bookAId(dto.getBookAId())
                .bookBId(dto.getBookBId())
                .requesterId(dto.getRequesterId())
                .responderId(dto.getResponderId())
                .type(ExchangeRequest.RequestType.EXCHANGE)
                .build();
        exchangeRequestRepository.save(request);

        // 2. 채팅방 정보 조회
        ChatRoom room = chatRoomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("채팅방을 찾을 수 없습니다."));

        // 3. 캘린더 등록 (교환일 기준)
        ChatCalendar calendar = ChatCalendar.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .exchangeDate(parseDate(dto.getExchangeDate()))
                .chatRoom(room)
                .requestId(request.getRequestId())
                .build();
        chatCalendarRepository.save(calendar);
    }

    /**
     * 📩 도서 대여 요청 처리 메서드
     * - 대여 요청을 저장하고, 대여 기간을 포함한 캘린더를 생성합니다.
     * @param dto 사용자의 대여 요청 정보
     */
    @Transactional
    public void requestRental(ExchangeRequestDto dto) {
        validateDuplicate(dto);

        // 1. 대여 요청 저장
        ExchangeRequest request = ExchangeRequest.builder()
                .bookAId(dto.getBookAId())
                .bookBId(dto.getBookBId())
                .requesterId(dto.getRequesterId())
                .responderId(dto.getResponderId())
                .type(ExchangeRequest.RequestType.RENTAL)
                .build();
        exchangeRequestRepository.save(request);

        // 2. 채팅방 정보 조회
        ChatRoom room = chatRoomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("채팅방을 찾을 수 없습니다."));

        // 3. 캘린더 등록 (대여 시작/종료일 기준)
        ChatCalendar calendar = ChatCalendar.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .rentalStartDate(parseDate(dto.getRentalStartDate()))
                .rentalEndDate(parseDate(dto.getRentalEndDate()))
                .chatRoom(room)
                .requestId(request.getRequestId())
                .build();
        chatCalendarRepository.save(calendar);
    }


    /**
     * ⚠️ 중복 거래 요청 방지
     * - 동일한 A→B 요청이 이미 존재할 경우 예외 발생
     */
    private void validateDuplicate(ExchangeRequestDto dto) {
        boolean exists = exchangeRequestRepository.existsByBookAIdAndBookBIdAndRequesterIdAndResponderId(
                dto.getBookAId(), dto.getBookBId(), dto.getRequesterId(), dto.getResponderId());
        if (exists) throw new IllegalStateException("이미 동일한 요청이 존재합니다.");
    }

    /**
     * 📅 ISO8601 문자열을 LocalDateTime으로 변환
     * @param dateString 문자열 (예: 2025-05-08T10:00:00)
     * @return LocalDateTime 객체
     */
    private LocalDateTime parseDate(String dateString) {
        return LocalDateTime.parse(dateString, DateTimeFormatter.ISO_DATE_TIME);
    }

    /**
     * 💬 매너 평가 제출 및 거래 완료 처리
     *
     * 1️⃣ 리뷰 정보 저장 (reviewerId → revieweeId 평점)
     * 2️⃣ 해당 거래 요청의 리뷰 수가 2개인지 확인 (양쪽 모두 작성 여부)
     * 3️⃣ 모두 완료 시 거래 상태 COMPLETED 로 변경
     * 4️⃣ 내가 제출한 책들을 상대방에게 소유권 이전 (Library + Book 모두 이전)
     * @return true: 거래 완료됨, false: 아직 상대방이 리뷰 미제출
     */
    @Transactional
    public boolean submitReview(Long reviewerId, ReviewSubmitRequest request) {
        // 🧍‍♂️ 1. 상대방 ID 식별
        Long revieweeId = request.getUserIds().stream()
                .filter(id -> !id.equals(reviewerId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("상대방 ID를 찾을 수 없습니다."));

        // ⚠️ 중복 리뷰 방지 (선택)
        if (reviewRepository.existsByRequestIdAndReviewerId(request.getRequestId(), reviewerId)) {
            throw new IllegalStateException("이미 리뷰를 제출한 사용자입니다.");
        }

        // 📝 2. 리뷰 정보 저장
        ExchangeRequestReview review = ExchangeRequestReview.builder()
                .requestId(request.getRequestId())
                .reviewerId(reviewerId)
                .revieweeId(revieweeId)
                .rating(request.getRating())
                .condition(request.getRatings().getCondition())
                .punctuality(request.getRatings().getPunctuality())
                .manner(request.getRatings().getManner())
                .build();
        reviewRepository.save(review);

        // ✅ 3. 리뷰 개수 확인 (2개일 때만 진행)
        List<ExchangeRequestReview> reviews = reviewRepository.findByRequestId(request.getRequestId());
        if (reviews.size() < 2) return false; // ❌ 상대방 리뷰 아직

        // ✅ 4. 거래 상태 → COMPLETED
        ExchangeRequest exchangeRequest = exchangeRequestRepository.findById(request.getRequestId())
                .orElseThrow(() -> new IllegalArgumentException("거래 요청이 존재하지 않습니다."));
        exchangeRequest.complete();

        // ✅ 5. 소유권 이전
        Users reviewee = Users.builder().userId(revieweeId).build();

        for (ReviewSubmitRequest.ReviewedBook book : request.getBooks()) {
            Library lib = libraryRepository.findById(book.getLibraryId())
                    .orElseThrow(() -> new IllegalArgumentException("도서가 존재하지 않습니다."));
            lib.transferTo(reviewee); // 📚 Library 소유자 변경
            Book entity = lib.getBook();
            if (entity != null) {
                entity.transferTo(reviewee); // 📘 Book 소유자 변경
            }
        }

        return true; // 🎉 거래 완료됨
    }


}