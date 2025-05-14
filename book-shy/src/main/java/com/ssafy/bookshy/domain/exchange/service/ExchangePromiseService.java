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
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import static com.ssafy.bookshy.domain.exchange.dto.ExchangePromiseDto.CounterpartDto;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExchangePromiseService {

    private final ExchangeRequestRepository exchangeRequestRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    /**
     * 로그인한 사용자의 예정된 교환/대여 거래 약속을 조회합니다.
     *
     * @return 거래 약속 목록 (Page 객체로 반환)
     */
    public List<ExchangePromiseDto> getPromiseList(Users user) {
        Long userId = user.getUserId();
        List<ExchangeRequest> requests = exchangeRequestRepository.findPromiseByUserId(userId, Pageable.unpaged());

        return requests.stream().map(request -> {
            Long counterpartId = request.getRequesterId().equals(userId)
                    ? request.getResponderId()
                    : request.getRequesterId();

            Users counterpart = userRepository.findById(counterpartId)
                    .orElseThrow(() -> new RuntimeException("상대방을 찾을 수 없습니다."));

            Long bookId = request.getRequesterId().equals(userId)
                    ? request.getBookBId()
                    : request.getBookAId();

            Book book = bookRepository.findById(bookId)
                    .orElseThrow(() -> new RuntimeException("도서를 찾을 수 없습니다."));

            TimeLeftDto timeLeft = calculateTimeLeft(request.getRequestedAt());

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
     * 주어진 시간까지 남은 시간을 계산하고, 사람이 보기 쉬운 표시 문자열로 구성합니다.
     *
     * @param scheduledTime 예정된 거래 시간
     * @return TimeLeftDto (일/시간/분 및 표시 텍스트 포함)
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
