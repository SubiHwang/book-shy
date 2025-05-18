package com.ssafy.bookshy.common.exception;

import com.ssafy.bookshy.common.response.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public enum JwtErrorCode implements ErrorCode {

    // 토큰 에러
    UNAUTHORIZED("인증이 필요합니다", 401),
    TOKEN_NOT_VALID("유효하지 않은 토큰입니다", 401),
    REFRESH_NOT_VALID("유효하지 않은 리프레쉬 토큰입니다.", 401),
    EXPIRED_TOKEN("만료된 토큰입니다", 401),
    TOKEN_NOT_FOUND("토큰을 찾을 수 없습니다", 401),
    AUTHENTICATION_FAILED("인증에 실패했습니다", 401);

    private final String message;
    private final int status;

}

