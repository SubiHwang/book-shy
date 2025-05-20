package com.ssafy.bookshy.domain.exchange.service;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.book.repository.BookRepository;
import com.ssafy.bookshy.domain.exchange.dto.ExchangePromiseDto;
import com.ssafy.bookshy.domain.exchange.dto.TimeLeftDto;
import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequest;
import com.ssafy.bookshy.domain.exchange.exception.ExchangeErrorCode;
import com.ssafy.bookshy.domain.exchange.exception.ExchangeException;
import com.ssafy.bookshy.domain.exchange.repository.ExchangeRequestRepository;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import static com.ssafy.bookshy.domain.exchange.dto.ExchangePromiseDto.CounterpartDto;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 📦 예정된 교환/대여 거래 약속 조회 서비스
 */
@Service
@RequiredArgsConstructor
public class ExchangePromiseService {

    private final ExchangeRequestRepository exchangeRequestRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    /**
     * ✅ 로그인한 사용자의 예정된 교환/대여 거래 약속을 조회합니다.
     *
     * - 사용자가 요청자 또는 응답자로 포함된 교환 요청 중,
     *   아직 완료되지 않은 약속들을 조회합니다.
     * - 상대방 정보, 도서 정보, 남은 시간 정보 등을 포함합니다.
     *
     * @param user 로그인한 사용자
     * @return 예정된 거래 약속 목록
     */
    public List<ExchangePromiseDto> getPromiseList(Users user) {
        Long userId = user.getUserId();

        // 1️⃣ 사용자가 포함된 예정된 교환 요청 조회
        List<ExchangeRequest> requests = exchangeRequestRepository.findPromiseByUserId(userId, Pageable.unpaged());

        // 2️⃣ 각 요청을 DTO로 변환
        return requests.stream().map(request -> {
            // 👥 상대방 ID 결정 (내가 요청자인 경우 상대는 응답자, 반대의 경우 요청자)
            Long counterpartId = request.getRequesterId().equals(userId)
                    ? request.getResponderId()
                    : request.getRequesterId();

            // 👤 상대방 사용자 조회 (없을 경우 예외)
            Users counterpart = userRepository.findById(counterpartId)
                    .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.USER_NOT_FOUND));

            // 📕 내가 받을 도서 ID 결정
            Long bookId = request.getRequesterId().equals(userId)
                    ? request.getBookBId()
                    : request.getBookAId();

            // 📘 도서 정보 조회 (없을 경우 예외)
            Book book = bookRepository.findById(bookId)
                    .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.BOOK_NOT_FOUND));

            // ⏰ 약속 시간까지 남은 시간 계산
            TimeLeftDto timeLeft = calculateTimeLeft(request.getRequestedAt());

            // 📦 응답 DTO 구성
            return ExchangePromiseDto.builder()
                    .tradeId(request.getRequestId())
                    .bookTitle(book.getTitle())
                    .scheduledTime(request.getRequestedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                    .status(request.getStatus().name())
                    .counterpart(CounterpartDto.builder()
                            .userId(counterpart.getUserId())
                            .nickname(counterpart.getNickname())
                            .profileImageUrl(counterpart.getProfileImageUrl())
                            .build())
                    .timeLeft(timeLeft)
                    .build();
        }).toList();
    }

    /**
     * ⏳ 주어진 거래 예정 시각까지 남은 시간을 계산하여 DTO로 반환합니다.
     *
     * - 일, 시간, 분 단위로 계산합니다.
     * - 사람이 읽기 쉬운 텍스트로 변환하여 display 필드에 포함합니다.
     *
     * @param scheduledTime 예정된 거래 시간
     * @return TimeLeftDto (남은 시간 + 표시 텍스트)
     */
    private TimeLeftDto calculateTimeLeft(LocalDateTime scheduledTime) {
        Duration duration = Duration.between(LocalDateTime.now(), scheduledTime);
        long minutes = duration.toMinutes();

        int days = (int) (minutes / (60 * 24));
        int hours = (int) ((minutes % (60 * 24)) / 60);
        int mins = (int) (minutes % 60);

        StringBuilder display = new StringBuilder();
        if (days > 0) display.append(days).append("일 ");
        if (hours > 0) display.append(hours).append("시간 ");
        if (mins > 0) display.append(mins).append("분 ");
        display.append("남음");

        return TimeLeftDto.builder()
                .days(days)
                .hours(hours)
                .minutes(mins)
                .display(display.toString().trim())
                .build();
    }
}
