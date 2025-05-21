package com.ssafy.bookshy.domain.exchange.service;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.book.repository.BookRepository;
import com.ssafy.bookshy.domain.chat.entity.ChatCalendar;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static com.ssafy.bookshy.domain.exchange.dto.ExchangePromiseDto.CounterpartDto;

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
     * ✅ 로그인 사용자가 참여한 거래 요청에 연결된 거래 일정 정보를 기반으로 거래 약속 목록을 조회합니다.
     * - 사용자 ID로 ChatCalendar를 먼저 조회
     * - 각 일정에 연결된 ExchangeRequest 요청 정보를 가져옴
     * - 그 요청에 대한 상대방, 책 정보, 일정 시간 등을 종합하여 응답
     *
     * @param user 로그인 사용자
     * @return 예정된 거래 약속 리스트
     */
    @Transactional(readOnly = true)
    public List<ExchangePromiseDto> getPromiseList(Users user) {
        Long userId = user.getUserId();
        log.info("📌 [{}] 사용자 거래 약속 조회 시작", userId);

        // 1️⃣ 오늘 이후의 일정만 필터링하여 조회
        List<ChatCalendar> calendars = chatCalendarRepository.findUpcomingByUserId(userId);
        log.info("🔍 [{}] 사용자의 거래 일정 수: {}", userId, calendars.size());

        List<ExchangePromiseDto> results = new ArrayList<>();

        for (ChatCalendar calendar : calendars) {
            Long requestId = calendar.getRequestId();
            log.info("🧾 거래 요청 ID: {}", requestId);

            // 2️⃣ 거래 요청 정보 조회
            ExchangeRequest request = exchangeRequestRepository.findById(requestId)
                    .orElseThrow(() -> {
                        log.warn("❌ 거래 요청 없음 - requestId: {}", requestId);
                        return new ExchangeException(ExchangeErrorCode.EXCHANGE_REQUEST_NOT_FOUND);
                    });

            boolean isRequester = request.getRequesterId().equals(userId);
            Long counterpartId = isRequester ? request.getResponderId() : request.getRequesterId();

            // 3️⃣ 상대방 정보 조회
            Users counterpart = userRepository.findById(counterpartId)
                    .orElseThrow(() -> {
                        log.warn("❌ 상대방 사용자 없음 - userId: {}", counterpartId);
                        return new ExchangeException(ExchangeErrorCode.USER_NOT_FOUND);
                    });

            // 4️⃣ 책 정보 조회
            Long myBookId = isRequester ? request.getBookAId() : request.getBookBId();
            Long partnerBookId = isRequester ? request.getBookBId() : request.getBookAId();

            Book myBook = bookRepository.findById(myBookId)
                    .orElseThrow(() -> {
                        log.warn("❌ 내 도서 정보 없음 - bookId: {}", myBookId);
                        return new ExchangeException(ExchangeErrorCode.BOOK_NOT_FOUND);
                    });

            Book partnerBook = bookRepository.findById(partnerBookId)
                    .orElseThrow(() -> {
                        log.warn("❌ 상대 도서 정보 없음 - bookId: {}", partnerBookId);
                        return new ExchangeException(ExchangeErrorCode.BOOK_NOT_FOUND);
                    });

            // 5️⃣ 일정 시간 추출
            LocalDateTime scheduledDateTime =
                    request.getType() == ExchangeRequest.RequestType.EXCHANGE
                            ? calendar.getExchangeDate()
                            : calendar.getRentalStartDate();

            if (scheduledDateTime == null) {
                log.warn("⚠️ 캘린더에 유효한 일정이 없음 - calendarId: {}", calendar.getCalendarId());
                continue; // 유효하지 않은 일정은 스킵
            }

            TimeLeftDto timeLeft = calculateTimeLeft(scheduledDateTime);

            // 6️⃣ DTO 구성
            ExchangePromiseDto dto = ExchangePromiseDto.builder()
                    .tradeId(request.getRequestId())
                    .type(request.getType().name())
                    .status(request.getStatus().name())
                    .scheduledTime(scheduledDateTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
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
                    .build();

            log.info("✅ 거래 약속 DTO 생성 완료 - tradeId: {}, 상대방: {}", requestId, counterpart.getNickname());
            results.add(dto);
        }

        log.info("🎯 [{}] 사용자에 대한 거래 약속 총 {}건 반환 완료", userId, results.size());
        return results;
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
