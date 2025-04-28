package com.ssafy.bookshy.common.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CommonResponseDto<T> {
    private boolean success; //요청 성공 여부(true/false)
    private T data; //실제 응답 데이터
    private ErrorResponse error; //에러 발생 시 에러 정보

    /**
     * 데이터와 함께 성공 응답을 생성
     *
     * @param data 응답할 데이터
     * @return 성공 응답 객체
     */
    public static <T> CommonResponseDto<T> ok(T data) {
        return CommonResponseDto.<T>builder()
                .success(true)
                .data(data)
                .build();
    }

    /**
     * 데이터 없이 성공 응답만 생성(단순 성공 케이스)
     *
     * @return 데이터 없는 성공 응답 객체
     */
    public static <T> CommonResponseDto<T> ok() {
        return CommonResponseDto.<T>builder()
                .success(true) // 성공이니까 true
                .build(); // 데이터는 없이 성공만 알림
    }

    /**
     * 에러 정보를 포함한 실패 응답 생성
     *
     * @param error 에러 정보 객체
     * @return 에러 응답 객체
     */
    public static <T> CommonResponseDto<T> error(ErrorResponse error) {
        return CommonResponseDto.<T>builder()
                .success(false) // 실패니까 false
                .error(error) // 에러 정보 설정
                .build();
    }


}
