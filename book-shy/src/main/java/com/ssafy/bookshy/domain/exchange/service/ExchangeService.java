package com.ssafy.bookshy.domain.exchange.service;

import com.ssafy.bookshy.domain.chat.entity.ChatCalendar;
import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.chat.repository.ChatCalendarRepository;
import com.ssafy.bookshy.domain.chat.repository.ChatRoomRepository;
import com.ssafy.bookshy.domain.exchange.dto.ExchangeRequestDto;
import com.ssafy.bookshy.domain.exchange.dto.ReviewRequestDto;
import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequest;
import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequestReview;
import com.ssafy.bookshy.domain.exchange.repository.ExchangeRequestRepository;
import com.ssafy.bookshy.domain.exchange.repository.ExchangeRequestReviewRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class ExchangeService {

    private final ExchangeRequestRepository exchangeRequestRepository;
    private final ExchangeRequestReviewRepository reviewRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatCalendarRepository chatCalendarRepository;

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
     * 🌟 거래 완료 후 매너 평가 등록
     * - 같은 거래에 대한 리뷰가 이미 존재하면 예외 발생
     * - 리뷰 테이블에 저장
     */
    @Transactional
    public void submitReview(ReviewRequestDto dto) {
        boolean exists = reviewRepository.existsByRequestIdAndReviewerId(dto.getRequestId(), dto.getReviewerId());
        if (exists) throw new IllegalStateException("이미 이 요청에 대한 리뷰를 작성하셨습니다.");

        ExchangeRequestReview review = ExchangeRequestReview.builder()
                .requestId(dto.getRequestId())
                .reviewerId(dto.getReviewerId())
                .revieweeId(dto.getRevieweeId())
                .rating(dto.getRating())
                .build();

        reviewRepository.save(review);
    }

    /**
     * 🌟 거래 완료 처리
     */
    @Transactional
    public void completeExchange(Long requestId, Long userId) {
        ExchangeRequest request = exchangeRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("해당 요청이 존재하지 않습니다."));

        // 1. 사용자가 해당 거래의 당사자인지 확인
        if (!request.getRequesterId().equals(userId) && !request.getResponderId().equals(userId)) {
            throw new SecurityException("해당 거래에 참여한 사용자만 완료할 수 있습니다.");
        }

        // 2. 이미 완료된 거래인지 체크
        if (request.getStatus() == ExchangeRequest.RequestStatus.COMPLETED) {
            throw new IllegalStateException("이미 완료된 거래입니다.");
        }

        // 3. 상태를 COMPLETED로 변경
        request.setStatus(ExchangeRequest.RequestStatus.COMPLETED);

        // 4. 필요한 후처리: 예) 알림, 포인트 적립 등
        // ...
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
}