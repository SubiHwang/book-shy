package com.ssafy.bookshy.common.dto;


import com.ssafy.bookshy.common.exception.ErrorCode;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ErrorResponse {
    private final String code;
    private final String message;
    private final int status;

    public static ErrorResponse of(ErrorCode errorCode) {
        return ErrorResponse.builder()
                .code(errorCode.code())
                .message(errorCode.getMessage())
                .status(errorCode.getStatus())
                .build();
    }

    public static ErrorResponse of(ErrorCode errorCode, String message) {
        return ErrorResponse.builder()
                .code(errorCode.code())
                .message(message)
                .status(errorCode.getStatus())
                .build();
    }

}