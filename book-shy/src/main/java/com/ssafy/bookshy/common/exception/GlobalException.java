package com.ssafy.bookshy.common.exception;

import lombok.Getter;

//에러가 발생했을 때 Handler 에게 주는 역할
@Getter
public class GlobalException extends RuntimeException {

    private final ErrorCode errorCode; // ErrorCode 인터페이스 타입의 필드를 선언

    public GlobalException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        //부모 클래스(RuntimeException)의 생성자를 호출해서 예외 메시지를 설정힘
        // 이렇게 하면 기본 예외 메시지로 ErrorCode에 정의된 메시지가 사용됨
        this.errorCode = errorCode;
    }
}

