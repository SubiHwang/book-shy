package com.ssafy.bookshy.domain.exchange.service;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.book.repository.BookRepository;
import com.ssafy.bookshy.domain.chat.entity.ChatCalendar;
import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.chat.repository.ChatCalendarRepository;
import com.ssafy.bookshy.domain.exchange.dto.ExchangePromiseDto;
import com.ssafy.bookshy.domain.exchange.dto.TimeLeftDto;
import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequest;
import com.ssafy.bookshy.domain.exchange.exception.ExchangeErrorCode;
import com.ssafy.bookshy.domain.exchange.exception.ExchangeException;
import com.ssafy.bookshy.domain.exchange.repository.ExchangeRequestRepository;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * 📦 교환/대여 약속 조회 서비스
 * - 로그인한 사용자가 참여 중인 예정된 도서 거래(교환 또는 대여) 정보를 조회합니다.
 * - 상대방 정보, 나의 도서, 상대방 도서, 남은 시간 등 다양한 정보를 포함한 DTO로 반환합니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ExchangePromiseService {

    private final ExchangeRequestRepository exchangeRequestRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final ChatCalendarRepository chatCalendarRepository;

    /**
     * ✅ 로그인 사용자가 참여 중인 거래 요청을 기반으로 거래 약속 목록을 조회합니다.
     * - 사용자가 요청자 또는 응답자인 경우를 포함해 모든 거래 요청을 조회합니다.
     * - 각 거래에 대해 상대방 정보, 나의 책/상대방 책, 남은 시간 등을 포함해 응답합니다.
     *
     * @param user 로그인 사용자
     * @return 예정된 거래 약속 정보 리스트
     */
    public List<ExchangePromiseDto> getPromiseList(Users user) {
        Long userId = user.getUserId();
        List<ExchangeRequest> requests = exchangeRequestRepository.findPromiseByUserId(userId, Pageable.unpaged());

        return requests.stream().map(request -> {
            boolean isRequester = request.getRequesterId().equals(userId);

            Long counterpartId = isRequester ? request.getResponderId() : request.getRequesterId();
            Users counterpart = userRepository.findById(counterpartId)
                    .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.UNAUTHORIZED_REVIEW_SUBMITTER));

            Long myBookId = isRequester ? request.getBookAId() : request.getBookBId();
            Long partnerBookId = isRequester ? request.getBookBId() : request.getBookAId();

            Book myBook = bookRepository.findById(myBookId)
                    .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.BOOK_NOT_FOUND));
            Book partnerBook = bookRepository.findById(partnerBookId)
                    .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.BOOK_NOT_FOUND));

            TimeLeftDto timeLeft = calculateTimeLeft(request.getRequestedAt());

            // roomId 추출 (ChatCalendar 통해)
            ChatCalendar calendar = chatCalendarRepository.findByRequestId(request.getRequestId()).orElse(null);
            Long roomId = (calendar != null && calendar.getChatRoom() != null) ? calendar.getChatRoom().getId() : null;

            return ExchangePromiseDto.builder()
                    .tradeId(request.getRequestId())
                    .type(request.getType().name())
                    .status(request.getStatus().name())
                    .scheduledTime(request.getRequestedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                    .requestedAt(request.getRequestedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                    .myBookId(myBook.getId())
                    .myBookTitle(myBook.getTitle())
                    .myBookCoverUrl(myBook.getCoverImageUrl())
                    .partnerBookId(partnerBook.getId())
                    .partnerBookTitle(partnerBook.getTitle())
                    .partnerBookCoverUrl(partnerBook.getCoverImageUrl())
                    .counterpart(ExchangePromiseDto.CounterpartDto.builder()
                            .userId(counterpart.getUserId())
                            .nickname(counterpart.getNickname())
                            .profileImageUrl(counterpart.getProfileImageUrl())
                            .build())
                    .timeLeft(timeLeft)
                    .userId(counterpart.getUserId())
                    .roomId(roomId)
                    .build();
        }).toList();
    }

    /**
     * ⏳ 예정 시각까지 남은 시간을 계산하여 사용자 친화적인 텍스트와 함께 반환합니다.
     *
     * @param scheduledTime 거래 예정 시각
     * @return TimeLeftDto (일, 시간, 분, 표시 문자열 포함)
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

    public List<Users> getAllActiveUsersWithUpcomingPromise() {
        List<ExchangeRequest> requests = exchangeRequestRepository.findAllWithFutureSchedule();

        // 요청자와 응답자 ID를 모두 수집
        Set<Long> userIds = new HashSet<>();
        for (ExchangeRequest req : requests) {
            userIds.add(req.getRequesterId());
            userIds.add(req.getResponderId());
        }

        // 사용자 엔티티 전체 조회
        return userRepository.findAllById(userIds);
    }
}
