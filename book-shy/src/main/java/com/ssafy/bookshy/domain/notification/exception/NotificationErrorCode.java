package com.ssafy.bookshy.domain.notification.exception;

import com.ssafy.bookshy.common.response.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum NotificationErrorCode implements ErrorCode {

    // 사용자 관련
    USER_NOT_FOUND(404, "사용자를 찾을 수 없습니다."),
    FCM_TOKEN_NOT_FOUND(400, "알림 수신 설정이 완료되지 않았습니다."),

    // Firebase 관련
    FIREBASE_CREDENTIALS_MISSING(500, "알림 서비스를 이용할 수 없습니다. 잠시 후 다시 시도해 주세요."),
    FIREBASE_AUTH_FAILED(500, "알림 서비스에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요."),
    FIREBASE_SEND_FAILED(500, "알림 전송에 실패했습니다. 다시 시도해 주세요."),

    // 메시지 관련
    INVALID_MESSAGE_PAYLOAD(400, "알림 전송 중 문제가 발생했습니다."),
    UNSUPPORTED_NOTIFICATION_TYPE(400, "알 수 없는 알림 유형입니다.");

    private final int status;
    private final String message;
}
