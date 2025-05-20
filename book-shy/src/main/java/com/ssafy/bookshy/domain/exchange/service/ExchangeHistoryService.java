package com.ssafy.bookshy.domain.exchange.service;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.book.repository.BookRepository;
import com.ssafy.bookshy.domain.exchange.dto.ExchangeHistoryDto;
import com.ssafy.bookshy.domain.exchange.dto.ExchangeHistoryGroupDto;
import com.ssafy.bookshy.domain.exchange.dto.ExchangeSummaryDto;
import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequest;
import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequest.RequestStatus;
import com.ssafy.bookshy.domain.exchange.exception.ExchangeErrorCode;
import com.ssafy.bookshy.domain.exchange.exception.ExchangeException;
import com.ssafy.bookshy.domain.exchange.repository.ExchangeRequestRepository;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 📦 교환 내역 관련 서비스
 */
@Service
@RequiredArgsConstructor
public class ExchangeHistoryService {

    private final ExchangeRequestRepository exchangeRequestRepository;
    private final UserService userService;
    private final BookRepository bookRepository;

    /**
     * ✅ 로그인한 사용자의 완료된 교환 내역을 조회합니다.
     *
     * - 요청자 또는 응답자 중 로그인한 사용자가 포함된 교환 요청만 필터링합니다.
     * - 상태가 COMPLETED인 요청만 조회합니다.
     * - 상대방 정보(닉네임, 프로필), 받은 책 / 준 책 정보까지 포함합니다.
     * - 반환 결과는 `yyyy.MM` 단위로 그룹핑됩니다.
     *
     * @param user 로그인한 사용자
     * @return 월별 그룹핑된 교환 내역 리스트
     */
    @Transactional
    public List<ExchangeHistoryGroupDto> getCompletedExchanges(Users user) {
        Long userId = user.getUserId();

        // 1️⃣ 해당 사용자가 참여한, 완료된 교환 요청 전체 조회
        List<ExchangeRequest> completedRequests =
                exchangeRequestRepository.findByUserAndStatus(userId, RequestStatus.COMPLETED, Pageable.unpaged());

        // 2️⃣ 각 교환 요청을 DTO로 변환
        List<ExchangeHistoryDto> dtoList = completedRequests.stream().map(request -> {
            // 👥 상대방 사용자 ID 결정
            Long counterpartId = request.getRequesterId().equals(userId)
                    ? request.getResponderId()
                    : request.getRequesterId();

            // 👤 상대방 닉네임 및 프로필 이미지 조회
            String nickname = userService.getNicknameById(counterpartId);
            String profileImageUrl = userService.getProfileImageUrlById(counterpartId);

            // 📘 받은 책 ID / 준 책 ID 결정
            Long receivedBookId = request.getRequesterId().equals(userId)
                    ? request.getBookBId()
                    : request.getBookAId();

            Long givenBookId = request.getRequesterId().equals(userId)
                    ? request.getBookAId()
                    : request.getBookBId();

            // 📕 받은 책 정보 조회 (없을 경우 예외 발생)
            Book receivedBook = bookRepository.findById(receivedBookId)
                    .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.BOOK_NOT_FOUND));

            // 📗 준 책 정보 조회 (없을 경우 예외 발생)
            Book givenBook = bookRepository.findById(givenBookId)
                    .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.BOOK_NOT_FOUND));

            // 📦 교환 내역 DTO 생성
            return ExchangeHistoryDto.builder()
                    .tradeId(request.getRequestId())
                    .counterpartNickname(nickname)
                    .counterpartProfileImageUrl(profileImageUrl)
                    .place("추후 구현된 장소 정보") // 장소 정보는 추후 확장 가능
                    .completedAt(request.getRequestedAt())
                    .tradeType(request.getType().name())
                    .receivedBookTitle(receivedBook.getTitle())
                    .receivedBookAuthor(receivedBook.getAuthor())
                    .receivedBookCoverUrl(receivedBook.getCoverImageUrl())
                    .givenBookTitle(givenBook.getTitle())
                    .givenBookAuthor(givenBook.getAuthor())
                    .givenBookCoverUrl(givenBook.getCoverImageUrl())
                    .build();
        }).toList();

        // 3️⃣ yyyy.MM 단위로 그룹핑하여 반환
        return dtoList.stream()
                .collect(Collectors.groupingBy(
                        dto -> dto.getCompletedAt().format(DateTimeFormatter.ofPattern("yyyy.MM")),
                        LinkedHashMap::new,
                        Collectors.toList()))
                .entrySet().stream()
                .map(entry -> ExchangeHistoryGroupDto.builder()
                        .yearMonth(entry.getKey())
                        .trades(entry.getValue())
                        .build())
                .toList();
    }

    @Transactional
    public ExchangeSummaryDto getExchangeSummary(Long userId) {
        // 교환 완료된 요청 목록
        List<ExchangeRequest> completedRequests =
                exchangeRequestRepository.findByUserAndStatus(userId, RequestStatus.COMPLETED, Pageable.unpaged());

        // 교환한 사람 수 (상대방 userId 중복 제거)
        int peopleCount = (int) completedRequests.stream()
                .map(req -> req.getRequesterId().equals(userId) ? req.getResponderId() : req.getRequesterId())
                .distinct()
                .count();

        // 교환한 책 수 (exchange_reviews_books 테이블 기준)
        int bookCount = exchangeRequestRepository.countReviewedBooksByUserId(userId);

        return ExchangeSummaryDto.builder()
                .peopleCount(peopleCount)
                .bookCount(bookCount)
                .build();
    }
}
