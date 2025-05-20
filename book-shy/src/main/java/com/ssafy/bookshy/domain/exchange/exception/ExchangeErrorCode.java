package com.ssafy.bookshy.domain.exchange.exception;

import com.ssafy.bookshy.common.response.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ExchangeErrorCode implements ErrorCode {

    // 🔹 요청 관련 오류
    DUPLICATE_REQUEST(409, "⚠️ 이미 동일한 거래 요청이 존재합니다."),
    INVALID_REQUEST_TYPE(400, "❌ 거래 유형은 EXCHANGE 또는 RENTAL만 가능합니다."),
    INVALID_USER_IDS(400, "❌ 사용자 ID 리스트는 정확히 2명이 포함되어야 합니다."),
    MISSING_BOOK_IDS(400, "❌ 도서 ID(bookAId/bookBId)는 모두 필수입니다."),

    // 🔹 날짜 누락 오류
    MISSING_EXCHANGE_DATE(400, "📛 EXCHANGE 일정에는 eventDate가 필수입니다."),
    MISSING_RENTAL_DATES(400, "📛 RENTAL 일정에는 startDate와 endDate가 필요합니다."),

    // 🔹 조회 실패
    CALENDAR_NOT_FOUND(404, "❌ 해당 채팅방의 거래 일정이 존재하지 않습니다."),
    EXCHANGE_REQUEST_NOT_FOUND(404, "❌ 해당 거래 요청 정보를 찾을 수 없습니다."),
    REVIEW_ALREADY_SUBMITTED(409, "⚠️ 이미 리뷰를 제출한 사용자입니다."),
    UNAUTHORIZED_REVIEW_SUBMITTER(403, "🚫 해당 거래의 리뷰를 제출할 권한이 없습니다."),
    BOOK_NOT_FOUND(404, "❌ 서재에서 도서를 찾을 수 없습니다."),
    CHATROOM_NOT_FOUND(404, "❌ 채팅방을 찾을 수 없습니다."),

    // 🔹 리뷰 관련
    INCOMPLETE_REVIEW(400, "📛 모든 평가 항목을 채워주세요."),
    TRADE_ALREADY_COMPLETED(409, "✅ 해당 거래는 이미 완료 처리되었습니다."),

    // 🔹 사용자 관련
    USER_NOT_FOUND(404, "❌ 사용자를 찾을 수 없습니다.");

    private final int status;
    private final String message;
}
