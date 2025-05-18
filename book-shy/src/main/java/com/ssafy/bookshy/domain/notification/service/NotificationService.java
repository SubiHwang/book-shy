package com.ssafy.bookshy.domain.notification.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.ssafy.bookshy.domain.notification.dto.ChatNotificationFcmDto;
import com.ssafy.bookshy.domain.notification.dto.FcmMessageTemplate;
import com.ssafy.bookshy.domain.notification.dto.FcmNotificationType;
import com.ssafy.bookshy.domain.notification.dto.MatchCompleteFcmDto;
import com.ssafy.bookshy.domain.notification.exception.NotificationErrorCode;
import com.ssafy.bookshy.domain.notification.exception.NotificationException;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String FIREBASE_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
    private static final String FCM_API_URL_TEMPLATE = "https://fcm.googleapis.com/v1/projects/%s/messages:send";
    private final UserRepository userRepository;

    public void sendTestNotification(Long userId, FcmNotificationType type) {
        sendFcm(userId, type, Map.of(
                "targetName", "제니",
                "date", "5월 15일",
                "senderName", "제니",
                "preview", "안녕하세요!",
                "partnerName", "제니",
                "userName", "잭슨",
                "bookTitle", "백설공주에게 죽음을",
                "subtype", "now",
                "url", "/chat/123"
        ));
    }

    public void sendChatNotification(ChatNotificationFcmDto dto) {
        sendFcm(dto.receiverId(), FcmNotificationType.CHAT_RECEIVE, Map.of(
                "senderNickName", dto.senderNickName(),
                "content", dto.content(),
                "chatRoomId", String.valueOf(dto.chatRoomId())
        ));
    }

    public void sendMatchCompleteNotification(MatchCompleteFcmDto dto) {
        sendFcm(dto.receiverId(), FcmNotificationType.MATCH_COMPLETE, Map.of(
                "partnerName", dto.partnerName(),
                "chatRoomId", String.valueOf(dto.chatRoomId())
        ));
    }

    public void sendTransactionNowNotification(Long receiverId, String partnerName, String date) {
        sendFcm(receiverId, FcmNotificationType.TRANSACTION_DATE, Map.of(
                "subtype", "now",
                "targetName", partnerName,
                "date", date,
                "url", "/mypage"
        ));
    }

    public void sendTransactionDayBeforeNotification(Long receiverId, String partnerName) {
        sendFcm(receiverId, FcmNotificationType.TRANSACTION_DATE, Map.of(
                "subtype", "day_before",
                "targetName", partnerName,
                "url", "/mypage"
        ));
    }

    public void sendTransactionTodayNotification(Long receiverId, String partnerName) {
        sendFcm(receiverId, FcmNotificationType.TRANSACTION_DATE, Map.of(
                "subtype", "today",
                "targetName", partnerName,
                "url", "/mypage"
        ));
    }

    public void sendBookRecommendation(Long receiverId, String userName, String bookTitle, Long itemId) {
        sendFcm(receiverId, FcmNotificationType.BOOK_RECOMMEND, Map.of(
                "userName", userName,
                "bookTitle", bookTitle,
                "itemId", String.valueOf(itemId)
        ));
    }

    private void sendFcm(Long userId, FcmNotificationType type, Map<String, String> data) {
        String targetToken = userRepository.findById(userId)
                .map(Users::getFcmToken)
                .orElseThrow(() -> new NotificationException(NotificationErrorCode.USER_NOT_FOUND));

        if (targetToken == null || targetToken.isBlank()) {
            throw new NotificationException(NotificationErrorCode.FCM_TOKEN_NOT_FOUND);
        }

        try {
            String credentialsPath = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");
            if (credentialsPath == null || credentialsPath.isBlank()) {
                throw new NotificationException(NotificationErrorCode.FIREBASE_CREDENTIALS_MISSING);
            }

            GoogleCredentials credentials = GoogleCredentials
                    .fromStream(new FileInputStream(credentialsPath))
                    .createScoped(List.of(FIREBASE_SCOPE));
            credentials.refreshIfExpired();
            String accessToken = credentials.getAccessToken().getTokenValue();

            FcmMessageTemplate.FcmMessage message = FcmMessageTemplate.build(type, data);

            JSONObject dataPayload = new JSONObject();
            dataPayload.put("title", message.title());
            dataPayload.put("body", message.body());
            dataPayload.put("url", message.url());
            data.forEach(dataPayload::put);

            JSONObject messageBody = new JSONObject();
            messageBody.put("token", targetToken);
            messageBody.put("data", dataPayload);

            JSONObject payload = new JSONObject();
            payload.put("message", messageBody);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);

            String projectId = System.getenv("FIREBASE_PROJECT_ID");
            String apiUrl = String.format(FCM_API_URL_TEMPLATE, projectId);

            HttpEntity<String> request = new HttpEntity<>(payload.toString(), headers);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);
            log.info("✅ v1 FCM 푸시 전송 성공: {}", response.getBody());

        } catch (IOException e) {
            throw new NotificationException(NotificationErrorCode.FIREBASE_AUTH_FAILED);
        } catch (Exception e) {
            log.error("❌ v1 FCM 푸시 전송 실패", e);
            throw new NotificationException(NotificationErrorCode.FIREBASE_SEND_FAILED);
        }
    }
}
