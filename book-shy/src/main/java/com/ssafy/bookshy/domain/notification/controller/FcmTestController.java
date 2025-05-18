package com.ssafy.bookshy.domain.notification.controller;

import com.ssafy.bookshy.domain.book.dto.BookListResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookListTotalResponseDto;
import com.ssafy.bookshy.domain.notification.dto.FcmNotificationType;
import com.ssafy.bookshy.domain.notification.service.NotificationService;
import com.ssafy.bookshy.domain.recommend.service.BookRecommendationService;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "🔔 FCM 테스트 API", description = "FCM 알림 테스트용 컨트롤러")
@RestController
@RequestMapping("/api/fcm/test")
@RequiredArgsConstructor
public class FcmTestController {

    private final NotificationService notificationService;
    private final BookRecommendationService bookRecommendationService;
    private final UserRepository userRepository;

    @Operation(summary = "📨 테스트용 푸시 알림 전송", description = """
            주어진 userId에게 다양한 유형의 테스트 알림을 전송합니다.<br/>
            - type 예시: TRANSACTION_DATE, CHAT_RECEIVE, MATCH_COMPLETE, BOOK_RECOMMEND
            """)
    @PostMapping("/send")
    public ResponseEntity<Void> testSend(
            @Parameter(description = "알림 수신 대상 사용자 ID", example = "1")
            @RequestParam Long userId,
            @Parameter(description = "알림 유형", example = "CHAT_RECEIVE")
            @RequestParam String type
    ) {
        notificationService.sendTestNotification(
                userId,
                FcmNotificationType.valueOf(type.toUpperCase())
        );
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "📬 도서 추천 알림 테스트", description = "지금 해당 사용자에게 도서 추천 알림을 전송합니다.")
    @PostMapping("/send/book-recommend")
    public ResponseEntity<Void> sendBookRecommendationTest(
            @Parameter(description = "알림 수신 대상 사용자 ID", example = "9")
            @RequestParam Long userId
    ) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

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

        return ResponseEntity.ok().build();
    }
}
