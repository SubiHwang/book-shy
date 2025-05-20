package com.ssafy.bookshy.domain.exchange.service;

import com.ssafy.bookshy.domain.book.repository.BookRepository;
import com.ssafy.bookshy.domain.exchange.dto.ExchangeHistoryDto;
import com.ssafy.bookshy.domain.exchange.dto.ExchangeHistoryDto.BookSummary;
import com.ssafy.bookshy.domain.exchange.dto.ExchangeHistoryGroupDto;
import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequest;
import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequest.RequestStatus;
import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequestReview;
import com.ssafy.bookshy.domain.exchange.entity.ExchangeReviewBook;
import com.ssafy.bookshy.domain.exchange.exception.ExchangeErrorCode;
import com.ssafy.bookshy.domain.exchange.exception.ExchangeException;
import com.ssafy.bookshy.domain.exchange.repository.ExchangeRequestRepository;
import com.ssafy.bookshy.domain.exchange.repository.ExchangeRequestReviewRepository;
import com.ssafy.bookshy.domain.exchange.repository.ExchangeReviewBookRepository;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 📦 교환 내역 관련 서비스
 * - 사용자가 완료한 거래 내역(COMPLETED 상태)을 조회하고
 * - 거래 상대 정보 및 내가 받은/준 책 리스트를 포함한 DTO로 반환합니다.
 */
@Service
@RequiredArgsConstructor
public class ExchangeHistoryService {

    private final ExchangeRequestRepository exchangeRequestRepository;
    private final ExchangeRequestReviewRepository reviewRepository;
    private final ExchangeReviewBookRepository reviewBookRepository;
    private final BookRepository bookRepository;
    private final UserService userService;

    /**
     * ✅ 로그인한 사용자의 완료된 거래 내역을 조회합니다.
     *
     * - 사용자가 요청자 또는 응답자인 COMPLETED 거래 요청만 필터링합니다.
     * - 각 요청에서 해당 사용자의 리뷰(reviewId)를 기준으로
     *   ➕ 내가 준 책, 받은 책을 구분해 도서 정보를 반환합니다.
     * - 결과는 yyyy.MM 단위로 그룹핑됩니다.
     *
     * @param user 로그인 사용자
     * @return 월별 그룹핑된 교환 내역 리스트
     */
    @Transactional
    public List<ExchangeHistoryGroupDto> getCompletedExchanges(Users user) {
        Long userId = user.getUserId();

        // 1️⃣ 완료된 거래 요청 조회
        List<ExchangeRequest> completedRequests =
                exchangeRequestRepository.findByUserAndStatus(userId, RequestStatus.COMPLETED, Pageable.unpaged());

        // 2️⃣ 요청별 교환 히스토리 생성
        List<ExchangeHistoryDto> dtoList = completedRequests.stream().map(request -> {
            Long requestId = request.getRequestId();
            boolean isRequester = request.getRequesterId().equals(userId);
            Long counterpartId = isRequester ? request.getResponderId() : request.getRequesterId();

            // 👤 상대방 정보 조회
            String nickname = userService.getNicknameById(counterpartId);
            String profileImageUrl = userService.getProfileImageUrlById(counterpartId);

            // 📄 리뷰 조회 (내가 작성한 리뷰 기준)
            ExchangeRequestReview myReview = reviewRepository.findByRequestIdAndReviewerId(requestId, userId)
                    .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.REVIEW_ALREADY_SUBMITTED));
            ExchangeRequestReview counterpartReview = reviewRepository.findByRequestIdAndReviewerId(requestId, counterpartId)
                    .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.REVIEW_ALREADY_SUBMITTED));

            // 📘 받은 책들 = 상대방이 등록한 도서 목록
            List<BookSummary> receivedBooks = reviewBookRepository.findByReview(counterpartReview).stream()
                    .map(this::toBookSummary)
                    .filter(Objects::nonNull)
                    .toList();

            // 📗 내가 건넨 책들 = 내가 등록한 도서 목록
            List<BookSummary> givenBooks = reviewBookRepository.findByReview(myReview).stream()
                    .map(this::toBookSummary)
                    .filter(Objects::nonNull)
                    .toList();

            return ExchangeHistoryDto.builder()
                    .tradeId(requestId)
                    .counterpartNickname(nickname)
                    .counterpartProfileImageUrl(profileImageUrl)
                    .completedAt(request.getRequestedAt())
                    .tradeType(request.getType().name())
                    .place("(추후 구현)")
                    .receivedBooks(receivedBooks)
                    .givenBooks(givenBooks)
                    .build();
        }).toList();

        // 3️⃣ yyyy.MM 기준으로 그룹핑
        return dtoList.stream()
                .collect(Collectors.groupingBy(
                        dto -> dto.getCompletedAt().format(DateTimeFormatter.ofPattern("yyyy.MM")),
                        LinkedHashMap::new,
                        Collectors.toList()
                ))
                .entrySet().stream()
                .map(entry -> ExchangeHistoryGroupDto.builder()
                        .yearMonth(entry.getKey())
                        .trades(entry.getValue())
                        .build())
                .toList();
    }
    /**
     * 🔄 ExchangeReviewBook 엔티티를 BookSummary로 변환
     * @param reviewBook 리뷰 도서 엔티티
     * @return BookSummary (null-safe)
     */
    private BookSummary toBookSummary(ExchangeReviewBook reviewBook) {
        return bookRepository.findById(reviewBook.getBookId())
                .map(book -> BookSummary.builder()
                        .bookId(book.getId())
                        .title(book.getTitle())
                        .author(book.getAuthor())
                        .coverUrl(book.getCoverImageUrl())
                        .build())
                .orElse(null);
    }
}
