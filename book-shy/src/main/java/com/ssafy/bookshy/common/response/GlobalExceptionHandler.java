package com.ssafy.bookshy.common.response;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 비즈니스 예외 처리
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<CommonResponse<Void>> handleBusinessException(BusinessException e) {
        ErrorCode errorCode = e.getErrorCode();
        log.error("비즈니스 예외 발생: {}, {}", errorCode.getStatus(), e.getMessage());

        ErrorResponse errorResponse = ErrorResponse.of(
                e.getMessage(),
                errorCode.getStatus()
        );

        return ResponseEntity
                .status(errorCode.getStatus())
                .body(CommonResponse.fail(errorResponse));
    }


    /**
     * 미디어 타입 호환성 오류 처리
     * Accept 헤더와 응답 미디어 타입이 일치하지 않을 때 발생
     */
    @ExceptionHandler(HttpMediaTypeNotAcceptableException.class)
    public ResponseEntity<CommonResponse<Void>> handleHttpMediaTypeNotAcceptableException(HttpMediaTypeNotAcceptableException e) {
        log.error("미디어 타입 호환성 오류: {}", e.getMessage());

        ErrorResponse errorResponse = ErrorResponse.of(
                "요청한 미디어 타입을 제공할 수 없습니다. (Accept 헤더 확인 필요)",
                HttpStatus.NOT_ACCEPTABLE.value()
        );

        // Content-Type을 application/json으로 강제 지정
        return ResponseEntity
                .status(HttpStatus.NOT_ACCEPTABLE)
                .header("Content-Type", "application/json;charset=UTF-8")
                .body(CommonResponse.fail(errorResponse));
    }

    /**
     * 잘못된 JSON 요청 처리
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    protected ResponseEntity<CommonResponse<Void>> handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
        log.error("잘못된 JSON 요청: {}", e.getMessage());

        ErrorResponse errorResponse = ErrorResponse.of(
                "JSON 파싱에 실패했습니다. 요청 본문을 확인해주세요", 400
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(CommonResponse.fail(errorResponse));
    }

    /**
     * 내부 서버 오류 처리
     */
    @ExceptionHandler(Exception.class)
    protected ResponseEntity<CommonResponse<Void>> handleException(Exception e) {
        log.error("내부 서버 오류 발생", e);

        ErrorResponse errorResponse = ErrorResponse.of(
                "서버 내부 오류가 발생했습니다",
                500
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(CommonResponse.fail(errorResponse));
    }

}
