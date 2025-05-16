package com.ssafy.bookshy.domain.notification.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.ssafy.bookshy.domain.notification.dto.ChatNotificationRequestDto;
import com.ssafy.bookshy.domain.notification.dto.FcmMessageTemplate;
import com.ssafy.bookshy.domain.notification.dto.FcmNotificationType;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.FileInputStream;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final RestTemplate restTemplate = new RestTemplate();

    // v1 방식용 상수
    private static final String FIREBASE_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
    private static final String FCM_API_URL_TEMPLATE = "https://fcm.googleapis.com/v1/projects/%s/messages:send";
    private final UserRepository userRepository;

    // 테스트용 알림
    public void sendTestNotification(Long userId, FcmNotificationType type) {
        sendFcm(userId, type, Map.of(
                "targetName", "제니",
                "date", "5월 15일",
                "senderName", "제니",
                "preview", "안녕하세요!",
                "partnerName", "제니",
                "userName", "잭슨",
                "bookTitle", "백설공주에게 죽음을",
                "subtype", "now"
        ));
    }

    public void sendChatNotification(ChatNotificationRequestDto request) {
        sendFcm(request.getReceiverId(), FcmNotificationType.CHAT_RECEIVE, Map.of(
                "senderName", request.getSenderNickName(),
                "preview", request.getContent()
        ));
    }

    public void sendTransactionNowNotification(Long receiverId, String partnerName, String date) {
        sendFcm(receiverId, FcmNotificationType.TRANSACTION_DATE, Map.of(
                "subtype", "now",
                "targetName", partnerName,
                "date", date
        ));
    }

    public void sendTransactionDayBeforeNotification(Long receiverId, String partnerName) {
        sendFcm(receiverId, FcmNotificationType.TRANSACTION_DATE, Map.of(
                "subtype", "day_before",
                "targetName", partnerName
        ));
    }

    public void sendTransactionTodayNotification(Long receiverId, String partnerName) {
        sendFcm(receiverId, FcmNotificationType.TRANSACTION_DATE, Map.of(
                "subtype", "today",
                "targetName", partnerName
        ));
    }

    public void sendMatchCompleteNotification(Long receiverId, String partnerName) {
        sendFcm(receiverId, FcmNotificationType.MATCH_COMPLETE, Map.of(
                "partnerName", partnerName
        ));
    }

    public void sendBookRecommendation(Long receiverId, String userName, String bookTitle) {
        sendFcm(receiverId, FcmNotificationType.BOOK_RECOMMEND, Map.of(
                "userName", userName,
                "bookTitle", bookTitle
        ));
    }

    // 공통 FCM 전송 로직 (v1 방식)
    private void sendFcm(Long userId, FcmNotificationType type, Map<String, String> data) {
        String targetToken = userRepository.findById(userId)
                .map(Users::getFcmToken)
                .orElse(null);

        if (targetToken == null) {
            log.warn("❌ FCM 토큰 없음 - userId: {}", userId);
            return;
        }

        try {
            // 1. OAuth2 인증 토큰 발급
            String credentialsPath = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");
            GoogleCredentials credentials = GoogleCredentials
                    .fromStream(new FileInputStream(credentialsPath))
                    .createScoped(List.of(FIREBASE_SCOPE));
            credentials.refreshIfExpired();
            String accessToken = credentials.getAccessToken().getTokenValue();

            // 2. 메시지 구성
            FcmMessageTemplate.FcmMessage message = FcmMessageTemplate.build(type, data);

            JSONObject notification = new JSONObject();
            notification.put("title", message.title());
            notification.put("body", message.body());

            JSONObject messageBody = new JSONObject();
            messageBody.put("token", targetToken);
            messageBody.put("notification", notification);

            // -------------------------------------------------------

//            JSONObject dataPayload = new JSONObject();
//            dataPayload.put("title", message.title());
//            dataPayload.put("body", message.body());
//            data.forEach(dataPayload::put);
//
//            JSONObject messageBody = new JSONObject();
//            messageBody.put("token", targetToken);
//            messageBody.put("data", dataPayload);

            // -------------------------------------------------------

            JSONObject payload = new JSONObject();
            payload.put("message", messageBody);

            // 3. 전송
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);

            String projectId = System.getenv("FIREBASE_PROJECT_ID");
            String apiUrl = String.format(FCM_API_URL_TEMPLATE, projectId);

            HttpEntity<String> request = new HttpEntity<>(payload.toString(), headers);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);
            log.info("✅ v1 FCM 푸시 전송 성공: {}", response.getBody());

        } catch (Exception e) {
            log.error("❌ v1 FCM 푸시 전송 실패", e);
        }
    }
}
