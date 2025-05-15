package com.ssafy.bookshy.common.response;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // Common (C로 시작)
    INVALID_INPUT_VALUE("C001", "입력값이 올바르지 않습니다", HttpStatus.BAD_REQUEST),
    METHOD_NOT_ALLOWED("C002", "지원하지 않는 메소드입니다", HttpStatus.METHOD_NOT_ALLOWED),
    INTERNAL_SERVER_ERROR("C003", "서버 내부 오류가 발생했습니다", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_TYPE_VALUE("C004", "타입이 올바르지 않습니다", HttpStatus.BAD_REQUEST),
    ACCESS_DENIED("C005", "접근 권한이 없습니다", HttpStatus.FORBIDDEN),

    // User (U로 시작)
    USER_NOT_FOUND("U001", "사용자를 찾을 수 없습니다", HttpStatus.NOT_FOUND),
    DUPLICATE_EMAIL("U002", "이미 사용중인 이메일입니다", HttpStatus.CONFLICT),
    DUPLICATE_NICKNAME("U003", "이미 사용중인 닉네임입니다", HttpStatus.CONFLICT),
    INVALID_PASSWORD("U004", "비밀번호가 올바르지 않습니다", HttpStatus.BAD_REQUEST),
    USER_STATUS_INVALID("U005", "사용자 상태가 유효하지 않습니다", HttpStatus.BAD_REQUEST),

    // Authentication (A로 시작)
    UNAUTHORIZED("A001", "인증이 필요합니다", HttpStatus.UNAUTHORIZED),
    INVALID_TOKEN("A002", "유효하지 않은 토큰입니다", HttpStatus.UNAUTHORIZED),
    EXPIRED_TOKEN("A003", "만료된 토큰입니다", HttpStatus.UNAUTHORIZED),
    TOKEN_NOT_FOUND("A004", "토큰을 찾을 수 없습니다", HttpStatus.UNAUTHORIZED),
    AUTHENTICATION_FAILED("A005", "인증에 실패했습니다", HttpStatus.UNAUTHORIZED),

    // Business Logic (B로 시작)
    INSUFFICIENT_BALANCE("B001", "잔액이 부족합니다", HttpStatus.BAD_REQUEST),
    ORDER_NOT_FOUND("B002", "주문을 찾을 수 없습니다", HttpStatus.NOT_FOUND),
    PRODUCT_NOT_FOUND("B003", "상품을 찾을 수 없습니다", HttpStatus.NOT_FOUND),
    PRODUCT_OUT_OF_STOCK("B004", "재고가 부족합니다", HttpStatus.BAD_REQUEST),
    INVALID_ORDER_STATUS("B005", "유효하지 않은 주문 상태입니다", HttpStatus.BAD_REQUEST),

    // External API (E로 시작)
    EXTERNAL_API_ERROR("E001", "외부 API 호출 중 오류가 발생했습니다", HttpStatus.BAD_GATEWAY),
    PAYMENT_API_ERROR("E002", "결제 API 오류가 발생했습니다", HttpStatus.BAD_GATEWAY),
    SMS_API_ERROR("E003", "SMS 발송 중 오류가 발생했습니다", HttpStatus.BAD_GATEWAY);

    private String code;
    private String message;
    private HttpStatus status;

    ErrorCode(String code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }

}
