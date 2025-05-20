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
import com.ssafy.bookshy.domain.exchange.exception.ExchangeErrorCode;
import com.ssafy.bookshy.domain.exchange.exception.ExchangeException;
import com.ssafy.bookshy.domain.exchange.repository.ExchangeRequestRepository;
import com.ssafy.bookshy.domain.exchange.repository.ExchangeRequestReviewRepository;
import com.ssafy.bookshy.domain.library.entity.Library;
import com.ssafy.bookshy.domain.library.repository.LibraryRepository;
import com.ssafy.bookshy.domain.notification.service.NotificationService;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

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
     * 1️⃣ 리뷰 정보 저장 (reviewerId → revieweeId 평점)
     * 2️⃣ 해당 거래 요청의 리뷰 수가 2개인지 확인 (양쪽 모두 작성 여부)
     * 3️⃣ 모두 완료 시 거래 상태 COMPLETED 로 변경
     * 4️⃣ 내가 제출한 책들을 상대방에게 소유권 이전 (Library + Book 모두 이전)
     * @param reviewerId 리뷰 작성자 ID
     * @param request 리뷰 요청 정보
     * @return true: 거래 완료됨, false: 상대방 리뷰 미제출
     */
    @Transactional
    public boolean submitReview(Long reviewerId, ReviewSubmitRequest request) {
        // 1️⃣ 상대방 ID 확인
        Long revieweeId = request.getUserIds().stream()
                .filter(id -> !id.equals(reviewerId))
                .findFirst()
                .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.UNAUTHORIZED_REVIEW_SUBMITTER));

        // 2️⃣ 중복 리뷰 방지
        if (reviewRepository.existsByRequestIdAndReviewerId(request.getRequestId(), reviewerId)) {
            throw new ExchangeException(ExchangeErrorCode.REVIEW_ALREADY_SUBMITTED);
        }

        // 3️⃣ 리뷰 저장
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

        // 4️⃣ 리뷰 수 체크
        List<ExchangeRequestReview> reviews = reviewRepository.findByRequestId(request.getRequestId());
        if (reviews.size() < 2) return false;

        // 5️⃣ 거래 상태 변경
        ExchangeRequest exchangeRequest = exchangeRequestRepository.findById(request.getRequestId())
                .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.EXCHANGE_REQUEST_NOT_FOUND));
        exchangeRequest.complete();

        // 6️⃣ 소유권 이전 (EXCHANGE만)
        if ("EXCHANGE".equalsIgnoreCase(request.getTradeType())) {
            Users reviewee = Users.builder().userId(revieweeId).build();

            for (ReviewSubmitRequest.ReviewedBook book : request.getBooks()) {
                Library lib = libraryRepository.findById(book.getLibraryId())
                        .orElseThrow(() -> new ExchangeException(ExchangeErrorCode.BOOK_NOT_FOUND));
                lib.transferTo(reviewee);
                Book entity = lib.getBook();
                if (entity != null) entity.transferTo(reviewee);
            }
        }

        return true;
    }


}