package com.ssafy.bookshy.domain.chat.exception;

import com.ssafy.bookshy.common.response.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ChatErrorCode implements ErrorCode {
    // ChatErrorCode.java

    MISSING_EXCHANGE_DATE(400, "📛 EXCHANGE 일정에는 eventDate가 필수입니다."),
    MISSING_RENTAL_DATES(400, "📛 RENTAL 일정에는 startDate와 endDate가 필요합니다."),
    INVALID_CALENDAR_TYPE(400, "❌ 거래 유형은 EXCHANGE 또는 RENTAL만 가능합니다."),
    CALENDAR_NOT_FOUND(404, "❌ 해당 채팅방의 거래 일정이 존재하지 않습니다.");


    private final int status;
    private final String message;
}
