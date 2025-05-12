package com.ssafy.bookshy.domain.notification.controller;

import com.ssafy.bookshy.domain.notification.dto.FcmNotificationType;
import com.ssafy.bookshy.domain.notification.service.NotificationService;
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
}
