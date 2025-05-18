package com.ssafy.bookshy.domain.notification.exception;

import com.ssafy.bookshy.common.response.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum NotificationErrorCode implements ErrorCode {

    // 사용자 관련
    USER_NOT_FOUND(404, "사용자를 찾을 수 없습니다."),
    FCM_TOKEN_NOT_FOUND(400, "사용자의 FCM 토큰이 존재하지 않습니다."),

    // Firebase 관련
    FIREBASE_CREDENTIALS_MISSING(500, "Firebase 인증 정보가 누락되었습니다."),
    FIREBASE_AUTH_FAILED(500, "Firebase 인증 토큰 발급에 실패했습니다."),
    FIREBASE_SEND_FAILED(500, "Firebase 메시지 전송에 실패했습니다."),

    // 메시지 관련
    INVALID_MESSAGE_PAYLOAD(400, "FCM 메시지 구성 중 오류가 발생했습니다."),
    UNSUPPORTED_NOTIFICATION_TYPE(400, "지원하지 않는 알림 유형입니다.");

    private final int status;
    private final String message;
}
