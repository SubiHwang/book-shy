package com.ssafy.bookshy.domain.notification.service;

import com.ssafy.bookshy.domain.notification.dto.ChatNotificationRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    public void sendChatNotification(ChatNotificationRequestDto request) {
        // TODO: 실제 FCM 또는 푸시 서비스 연동
        System.out.println("[알림] " + request.getReceiverId() + "에게 채팅 알림 전송: " + request.getContent());
    }
}
