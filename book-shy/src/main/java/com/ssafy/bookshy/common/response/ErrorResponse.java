package com.ssafy.bookshy.common.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {
    private String code; //ENUM의 NAME을 사용
    private String detail;

    // 간단한 에러 생성
    public static ErrorResponse of(String code, String detail) {
        return ErrorResponse.builder()
                .code(code)
                .detail(detail)
                .build();
    }

}
