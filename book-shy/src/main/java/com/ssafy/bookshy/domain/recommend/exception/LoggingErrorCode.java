package com.ssafy.bookshy.domain.recommend.exception;

import com.ssafy.bookshy.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum LoggingErrorCode implements ErrorCode {

    // 사용자 정보 관련 에러
    LOGGIN_ERROR(400, "닉네임은 12자리 이하이어야 합니다.");

    private final int status;
    private final String message;

    @Override
    public String code() {
        return name();
    }

}
