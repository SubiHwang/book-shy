package com.ssafy.bookshy.domain.exchange.service;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.chat.entity.ChatCalendar;
import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.chat.repository.ChatCalendarRepository;
import com.ssafy.bookshy.domain.chat.repository.ChatRoomRepository;
import com.ssafy.bookshy.domain.exchange.dto.*;
import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequest;
import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequestReview;
import com.ssafy.bookshy.domain.exchange.entity.ExchangeReviewBook;
import com.ssafy.bookshy.domain.exchange.exception.ExchangeErrorCode;
import com.ssafy.bookshy.domain.exchange.exception.ExchangeException;
import com.ssafy.bookshy.domain.exchange.repository.ExchangeRequestRepository;
import com.ssafy.bookshy.domain.exchange.repository.ExchangeRequestReviewRepository;
import com.ssafy.bookshy.domain.exchange.repository.ExchangeReviewBookRepository;
import com.ssafy.bookshy.domain.library.entity.Library;
import com.ssafy.bookshy.domain.library.repository.LibraryRepository;
import com.ssafy.bookshy.domain.notification.service.NotificationService;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExchangeService {

    private final ExchangeRequestRepository exchangeRequestRepository;
    private final ExchangeRequestReviewRepository reviewRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatCalendarRepository chatCalendarRepository;
    private final LibraryRepository libraryRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final ExchangeReviewBookRepository reviewBookRepository;

    /**
     * 📩 도서 교환 요청 처리
     *
     * - 교환 요청 저장
     * - 채팅방 존재 여부 확인
     * - 캘린더 등록 (교환일 포함)
     *
     * @param dto 교환 요청 정보
     */
    @Transactional
    public void requestExchange(ExchangeRequestDto dto) {
        validateDuplicate(dto);

        // 1️⃣ 교환 요청 저장
        ExchangeRequest request = ExchangeRequest.builder()
                .bookAId(dto.getBookAId())
                .bookBId(dto.getBookBId())
                .requesterId(dto.getRequesterId())
                .responderId(dto.getResponderId())
                .type(ExchangeRequest.RequestType.EXCHANGE)
                .build();
        exchangeRequestRepository.save(request);

        // 2️⃣ 채팅방 존재 여부 확인
        ChatRoom room = chatRoomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.CHATROOM_NOT_FOUND));

        // 3️⃣ 캘린더 등록
        ChatCalendar calendar = ChatCalendar.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .exchangeDate(parseDate(dto.getExchangeDate()))
                .chatRoom(room)
                .requestId(request.getRequestId())
                .build();
        chatCalendarRepository.save(calendar);

        // 알림 전송
        Users requester = userRepository.findById(dto.getRequesterId())
                .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.USER_NOT_FOUND));
        Users responder = userRepository.findById(dto.getResponderId())
                .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.USER_NOT_FOUND));

        notificationService.sendTransactionReminder(
                responder.getUserId(),
                requester.getNickname(),
                dto.getExchangeDate().substring(0, 10)
        );
    }

    /**
     * 📩 도서 대여 요청 처리
     *
     * - 대여 요청 저장
     * - 채팅방 존재 여부 확인
     * - 대여 기간 포함 캘린더 등록
     *
     * @param dto 대여 요청 정보
     */
    @Transactional
    public void requestRental(ExchangeRequestDto dto) {
        validateDuplicate(dto);

        ExchangeRequest request = ExchangeRequest.builder()
                .bookAId(dto.getBookAId())
                .bookBId(dto.getBookBId())
                .requesterId(dto.getRequesterId())
                .responderId(dto.getResponderId())
                .type(ExchangeRequest.RequestType.RENTAL)
                .build();
        exchangeRequestRepository.save(request);

        ChatRoom room = chatRoomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.CHATROOM_NOT_FOUND));

        ChatCalendar calendar = ChatCalendar.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .rentalStartDate(parseDate(dto.getRentalStartDate()))
                .rentalEndDate(parseDate(dto.getRentalEndDate()))
                .chatRoom(room)
                .requestId(request.getRequestId())
                .build();
        chatCalendarRepository.save(calendar);

        // 알림 전송
        Users requester = userRepository.findById(dto.getRequesterId())
                .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.USER_NOT_FOUND));
        Users responder = userRepository.findById(dto.getResponderId())
                .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.USER_NOT_FOUND));

        notificationService.sendTransactionReminder(
                responder.getUserId(),
                requester.getNickname(),
                dto.getExchangeDate().substring(0, 10)
        );
    }


    /**
     * ⚠️ 중복 거래 요청 방지
     * - 동일한 요청자가 동일한 책으로 동일인에게 요청한 경우 예외 발생
     */
    private void validateDuplicate(ExchangeRequestDto dto) {
        boolean exists = exchangeRequestRepository.existsByBookAIdAndBookBIdAndRequesterIdAndResponderId(
                dto.getBookAId(), dto.getBookBId(), dto.getRequesterId(), dto.getResponderId());
        if (exists) {
            throw new ExchangeException(ExchangeErrorCode.DUPLICATE_REQUEST);
        }
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
     * - 리뷰 저장 (리뷰어 → 리뷰이)
     * - 거래 요청의 리뷰 수가 2명인지 확인
     * - 모든 리뷰 완료 시 상태 COMPLETED로 변경
     * - 교환인 경우 넘긴 책들의 소유권을 리뷰이에게 이전
     *
     * @param reviewerId 리뷰 작성자 ID
     * @param request 리뷰 요청 정보
     * @return true: 거래 완료됨, false: 상대방 리뷰 미제출
     */
    @Transactional
    public boolean submitReview(Long reviewerId, ReviewSubmitRequest request) {
        log.info("📥 리뷰 제출 요청 도착 - reviewerId: {}, requestId: {}", reviewerId, request.getRequestId());

        // 1️⃣ 상대방 ID 추출
        Long revieweeId = request.getUserIds().stream()
                .filter(id -> !id.equals(reviewerId))
                .findFirst()
                .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.UNAUTHORIZED_REVIEW_SUBMITTER));
        log.info("👤 상대방 ID 확인 완료 - revieweeId: {}", revieweeId);

        // 2️⃣ 중복 리뷰 방지
        if (reviewRepository.existsByRequestIdAndReviewerId(request.getRequestId(), reviewerId)) {
            log.warn("⚠️ 이미 리뷰를 제출한 사용자입니다. reviewerId: {}, requestId: {}", reviewerId, request.getRequestId());
            throw new ExchangeException(ExchangeErrorCode.REVIEW_ALREADY_SUBMITTED);
        }

        // 3️⃣ 리뷰 정보 저장
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
        log.info("✅ 리뷰 저장 완료 - reviewerId: {}, rating: {}", reviewerId, review.getRating());

        // 4️⃣ 책 임시 저장 (ExchangeReviewBook 테이블)
        for (ReviewSubmitRequest.ReviewedBook dto : request.getBooks()) {
            ExchangeReviewBook reviewBook = ExchangeReviewBook.builder()
                    .review(review)
                    .bookId(dto.getBookId())
                    .libraryId(dto.getLibraryId())
                    .aladinItemId(dto.getAladinItemId())
                    .fromMatching(dto.isFromMatching())
                    .ownerId(reviewerId)
                    .requestId(request.getRequestId())
                    .build();
            reviewBookRepository.save(reviewBook);
            log.info("📌 리뷰 도서 임시 저장 - bookId: {}, libraryId: {}, ownerId: {}", dto.getBookId(), dto.getLibraryId(), reviewerId);
        }

        // 5️⃣ 리뷰 수 체크
        List<ExchangeRequestReview> reviews = reviewRepository.findByRequestId(request.getRequestId());
        log.info("📊 현재까지 리뷰 개수: {}", reviews.size());
        if (reviews.size() < 2) {
            log.info("⏳ 상대방 리뷰 미작성 - 거래 완료 대기 중");
            return false;
        }

        // 6️⃣ 거래 상태 변경
        ExchangeRequest exchangeRequest = exchangeRequestRepository.findById(request.getRequestId())
                .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.EXCHANGE_REQUEST_NOT_FOUND));
        exchangeRequest.complete();
        log.info("🔁 거래 상태 변경 완료 - COMPLETED (requestId: {})", exchangeRequest.getRequestId());

        // 7️⃣ 교환일 경우 도서 소유권 교차 이전
        if ("EXCHANGE".equalsIgnoreCase(request.getTradeType())) {
            List<ExchangeReviewBook> allBooks = reviewBookRepository.findByRequestId(request.getRequestId());
            for (ExchangeReviewBook book : allBooks) {
                // 교환 대상자 설정
                Long newOwnerId = book.getOwnerId().equals(reviewerId) ? revieweeId : reviewerId;
                Users newOwner = Users.builder().userId(newOwnerId).build();

                // 소유권 이전
                Library lib = libraryRepository.findById(book.getLibraryId())
                        .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.BOOK_NOT_FOUND));
                lib.transferTo(newOwner);
                log.info("📚 서재 소유권 이전 - libraryId: {}, newOwnerId: {}", lib.getId(), newOwnerId);

                Book entity = lib.getBook();
                if (entity != null) {
                    entity.transferTo(newOwner);
                    log.info("📘 도서 소유권 이전 - bookId: {}, newOwnerId: {}", entity.getId(), newOwnerId);
                }
            }
            log.info("✅ 모든 도서에 대한 소유권 이전 완료");
        }

        log.info("🎉 거래 완료 처리 성공 - requestId: {}", request.getRequestId());
        return true;
    }
    
    /**
     * 🔍 리뷰 작성 여부 확인 서비스
     *
     * 1️⃣ 채팅방 존재 확인
     * 2️⃣ 거래 요청 존재 및 참여자 확인
     * 3️⃣ 사용자의 리뷰 작성 여부 및 리뷰 정보 반환
     * 4️⃣ 상대방 리뷰 작성 여부 반환
     */
    @Transactional
    public ReviewStatusResponse getReviewStatus(Long userId, Long roomId, Long requestId) {

        // 1️⃣ 채팅방 존재 확인
        chatRoomRepository.findById(roomId).orElseThrow(
                () -> new ExchangeException(ExchangeErrorCode.CHATROOM_NOT_FOUND));

        // 2️⃣ 거래 요청 존재 및 참여자 확인
        ExchangeRequest request = exchangeRequestRepository.findById(requestId)
                .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.EXCHANGE_REQUEST_NOT_FOUND));

        if (!request.getRequesterId().equals(userId) && !request.getResponderId().equals(userId)) {
            throw new ExchangeException(ExchangeErrorCode.REVIEW_FORBIDDEN);
        }

        // 3️⃣ 사용자 리뷰 확인
        ExchangeRequestReview myReview = reviewRepository
                .findByRequestIdAndReviewerId(requestId, userId).orElse(null);

        // 4️⃣ 상대방 리뷰 확인
        Long partnerId = request.getRequesterId().equals(userId) ? request.getResponderId() : request.getRequesterId();
        ExchangeRequestReview partnerReview = reviewRepository
                .findByRequestIdAndReviewerId(requestId, partnerId).orElse(null);

        return ReviewStatusResponse.builder()
                .hasReviewed(myReview != null)
                .reviewStatus(ReviewStatusResponse.ReviewStatus.builder()
                        .myReview(myReview != null ? new MyReview(myReview) : null)
                        .partnerReview(new PartnerReview(partnerReview != null, partnerReview != null ? partnerReview.getCreatedAt() : null))
                        .build())
                .build();
    }
}