package com.ssafy.bookshy.domain.notification.exception;

import com.ssafy.bookshy.common.response.BusinessException;

public class NotificationException extends BusinessException {
    public NotificationException(NotificationErrorCode errorCode) {
        super(errorCode);
    }
}
