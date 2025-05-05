package com.ssafy.bookshy.domain.exchange.service;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.book.repository.BookRepository;
import com.ssafy.bookshy.domain.exchange.dto.ExchangePromiseDto;
import com.ssafy.bookshy.domain.exchange.dto.TimeLeftDto;
import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequest;
import com.ssafy.bookshy.domain.exchange.repository.ExchangeRequestRepository;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static com.ssafy.bookshy.domain.exchange.dto.ExchangePromiseDto.CounterpartDto;

@Service
@RequiredArgsConstructor
public class ExchangePromiseService {

    private final ExchangeRequestRepository exchangeRequestRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    /**
     * 로그인한 사용자의 예정된 교환/대여 거래 약속을 페이지네이션으로 조회합니다.
     *
     * @param userId   사용자 ID
     * @param pageable 페이지 정보
     * @return 거래 약속 목록
     */
    public Page<ExchangePromiseDto> getPromiseList(Long userId, Pageable pageable) {
        return exchangeRequestRepository.findPromiseByUserId(userId, pageable)
                .map(request -> {
                    // 상대방 정보 추출
                    Long counterpartId = request.getRequesterId().equals(userId)
                            ? request.getResponderId()
                            : request.getRequesterId();
                    Users counterpart = userRepository.findById(counterpartId)
                            .orElseThrow(() -> new RuntimeException("상대방을 찾을 수 없습니다."));

                    // 받은 책 정보 추출 (기준: 내가 responder라면 상대방 책)
                    Long bookId = request.getRequesterId().equals(userId)
                            ? request.getBookBId()
                            : request.getBookAId();
                    Book book = bookRepository.findById(bookId)
                            .orElseThrow(() -> new RuntimeException("도서를 찾을 수 없습니다."));

                    // 남은 시간 계산
                    TimeLeftDto timeLeft = calculateTimeLeft(request.getRequestedAt());

                    return ExchangePromiseDto.builder()
                            .tradeId(request.getRequestId())
                            .bookTitle(book.getTitle())
                            .scheduledTime(request.getRequestedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                            .status(request.getStatus().name())
                            .counterpart(CounterpartDto.builder()
                                    .userId(counterpart.getId())
                                    .nickname(counterpart.getNickname())
                                    .profileImageUrl("/images/profile/" + counterpart.getProfileImageUrl())
                                    .build())
                            .timeLeft(timeLeft)
                            .build();
                });
    }

    /**
     * 주어진 시간까지 남은 시간을 계산하고, 표시 형식을 포함한 DTO로 반환합니다.
     *
     * @param scheduledTime 예정된 시간
     * @return 남은 시간 DTO
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
