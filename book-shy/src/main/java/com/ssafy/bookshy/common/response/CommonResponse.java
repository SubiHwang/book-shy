package com.ssafy.bookshy.common.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CommonResponse<T> { // 인자로 어떠한 것도 들어올 수 있음
    private int status;
    private boolean success;
    private String message;
    private T data;
    private ErrorResponse error;
    private LocalDateTime timestamp;

    //성공응답 - 데이터 있는 경우
    public static <T> CommonResponse<T> success(T data) {
        return CommonResponse.<T>builder()
                .status(200)
                .success(true)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    // 성공 응답 - 데이터 없는 경우
    public static CommonResponse<Void> success() {
        return CommonResponse.<Void>builder()
                .status(200)
                .success(true)
                .timestamp(LocalDateTime.now())
                .build();
    }

    // 실패 응답 - 에러 정보와 함께
    public static <T> CommonResponse<T> fail(ErrorResponse error) {
        return CommonResponse.<T>builder()
                .status(error.getStatus())
                .success(false)
                .error(error)
                .timestamp(LocalDateTime.now())
                .build();
    }


}
