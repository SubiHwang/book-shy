package com.ssafy.bookshy.domain.notification.controller;

import com.ssafy.bookshy.common.response.CommonResponse;
import com.ssafy.bookshy.domain.book.dto.BookListResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookListTotalResponseDto;
import com.ssafy.bookshy.domain.exchange.service.ExchangeReminderService;
import com.ssafy.bookshy.domain.notification.dto.FcmNotificationType;
import com.ssafy.bookshy.domain.notification.exception.NotificationErrorCode;
import com.ssafy.bookshy.domain.notification.exception.NotificationException;
import com.ssafy.bookshy.domain.notification.service.NotificationService;
import com.ssafy.bookshy.domain.recommend.service.BookRecommendationService;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "🔔 FCM 테스트 API", description = "FCM 알림 테스트용 컨트롤러")
@RestController
@RequestMapping("/api/fcm/test")
@RequiredArgsConstructor
public class FcmTestController {

    private final NotificationService notificationService;
    private final BookRecommendationService bookRecommendationService;
    private final UserRepository userRepository;
    private final ExchangeReminderService exchangeReminderService;

    @Operation(summary = "📨 테스트용 푸시 알림 전송", description = """
            주어진 userId에게 다양한 유형의 테스트 알림을 전송합니다.<br/>
            - type 예시: TRANSACTION_DATE, CHAT_RECEIVE, MATCH_COMPLETE, BOOK_RECOMMEND
            """)
    @PostMapping("/send")
    public CommonResponse<Void> testSend(
            @Parameter(description = "알림 수신 대상 사용자 ID", example = "1")
            @RequestParam Long userId,
            @Parameter(description = "알림 유형", example = "CHAT_RECEIVE")
            @RequestParam String type
    ) {
        notificationService.sendTestNotification(
                userId,
                FcmNotificationType.valueOf(type.toUpperCase())
        );
        return CommonResponse.success();
    }

    @Operation(summary = "📬 도서 추천 알림 테스트", description = "지금 해당 사용자에게 도서 추천 알림을 전송합니다.")
    @PostMapping("/send/book-recommend")
    public CommonResponse<Void> sendBookRecommendationTest(
            @Parameter(description = "알림 수신 대상 사용자 ID", example = "9")
            @RequestParam Long userId
    ) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new NotificationException(NotificationErrorCode.USER_NOT_FOUND));

        BookListTotalResponseDto recs = bookRecommendationService.getAllRecommendations(userId);

        if (!recs.getBooks().isEmpty()) {
            BookListResponseDto book = recs.getBooks().get(0);
            notificationService.sendBookRecommendation(
                    userId,
                    user.getNickname(),
                    book.getTitle(),
                    book.getItemId()
            );
        }

        return CommonResponse.success();
    }

    @Operation(
            summary = "🧪 교환 약속 알림 테스트",
            description = """
        📬 특정 사용자의 도서 교환/대여 약속에 대해 <b>테스트용 알림</b>을 전송합니다.<br><br>
        <b>사용 가능한 subtype</b>:
        <ul>
            <li><code>day_before</code> – 하루 전 알림</li>
            <li><code>today</code> – 당일 14시 알림</li>
        </ul>
        🔒 실 서비스에서는 인증된 사용자 기준으로 전송되지만,<br>
        🧪 테스트용 API는 <code>userId</code>를 직접 지정할 수 있습니다.
        """
    )
    @GetMapping("/promise/reminder/test")
    public CommonResponse<?> testPromiseReminder(
            @Parameter(description = "테스트 대상 사용자 ID", example = "9")
            @RequestParam Long userId,

            @Parameter(description = "알림 유형 (day_before 또는 today)", example = "day_before", required = true)
            @RequestParam String subtype
    ) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new NotificationException(NotificationErrorCode.USER_NOT_FOUND));

        exchangeReminderService.sendReminderTestForce(user, subtype);
        return CommonResponse.success("알림 테스트 전송 완료 (" + subtype + ")");
    }
}
