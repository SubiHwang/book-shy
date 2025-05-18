package com.ssafy.bookshy.common.exception;

import com.ssafy.bookshy.common.response.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum GlobalErrorCode implements ErrorCode {
    UNDEFINED_URL("요청하신 URL을 찾을 수 없습니다.", 404);

    private final String message;
    private final int status;

}
