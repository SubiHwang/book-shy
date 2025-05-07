package com.ssafy.bookshy.common.exception;

import com.ssafy.bookshy.common.dto.CommonResponseDto;
import com.ssafy.bookshy.common.dto.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

/**
 * 전역 예외 처리를 담당하는 클래스
 * 애플리케이션에서 발생하는 모든 예외를 중앙에서 처리하여 일관된 오류 응답 형식을 제공함
 */

@Slf4j
@RestControllerAdvice  // 모든 컨트롤러에 적용되는 전역 예외 처리기로 설정
public class GlobalExceptionHandler {

    // Global 예외 처리
    @ExceptionHandler(GlobalException.class) //@ExceptionHandler 어노테이션으로 GlobalException가 호출되면 이 함수가 실행된다.
    public ResponseEntity<CommonResponseDto<Object>> handleGlobalException(GlobalException e) {
        log.error("Global Exception occurred: {} - {}", e.getErrorCode());

        // ErrorResponse 객체 생성 - 에러 코드에서 정보를 추출해 구조화된 에러 정보 생성
        ErrorResponse errorResponse = ErrorResponse.of(e.getErrorCode());

        // ResponseEntity를 사용해 HTTP 응답 생성
        return ResponseEntity
                //.status(e.getErrorCode().getStatus()) // HTTP 상태 코드 설정 (예: 404, 400, 500 등)
                //본문에 넣는거는 프론트엔드 개발자가 더 쉽게 구별하기 위함이고 http 응답에서는 반드시 상태코드를 포함해야 한다.
                //위에. status를 없애면 200이 default로 나온다.
                .ok()  // 항상 HTTP 200 OK 상태 코드 반환
                .body(CommonResponseDto.error(errorResponse)); // 응답 본문에 표준화된 에러 정보 포함
    }

    // 입력값 검증 예외 처리
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<CommonResponseDto<Object>> handleValidationExceptions(
            MethodArgumentNotValidException e) {
        FieldError fieldError = e.getBindingResult().getFieldError();
        String errorMessage = fieldError != null
                ? fieldError.getDefaultMessage()
                : GlobalErrorCode.INVALID_INPUT_VALUE.getMessage();

        ErrorResponse errorResponse = ErrorResponse.of(GlobalErrorCode.INVALID_INPUT_VALUE, errorMessage);
        return ResponseEntity
                .status(GlobalErrorCode.INVALID_INPUT_VALUE.getStatus())
                .body(CommonResponseDto.error(errorResponse));
    }

    // 기본 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonResponseDto<Object>> handleException(Exception e) {
        log.error("Unexpected Exception occurred:", e);

        ErrorResponse errorResponse = ErrorResponse.of(GlobalErrorCode.INTERNAL_SERVER_ERROR);
        return ResponseEntity
                .status(GlobalErrorCode.INTERNAL_SERVER_ERROR.getStatus())
                .body(CommonResponseDto.error(errorResponse));
    }

    // Resource Not Found 예외 처리
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<CommonResponseDto<Object>> handleNoResourceFoundException(
            NoResourceFoundException e) {
        log.error("Resource not found:", e);

        ErrorResponse errorResponse = ErrorResponse.of(GlobalErrorCode.RESOURCE_NOT_FOUND);
        return ResponseEntity
                .status(GlobalErrorCode.RESOURCE_NOT_FOUND.getStatus())
                .body(CommonResponseDto.error(errorResponse));
    }

    // 지원하지 않는 HTTP 메서드 요청 처리
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<CommonResponseDto<Object>> handleMethodNotAllowed(
            HttpRequestMethodNotSupportedException e) {
        log.error("Method not allowed:", e);

        ErrorResponse errorResponse = ErrorResponse.of(GlobalErrorCode.METHOD_NOT_ALLOWED);
        return ResponseEntity
                .status(GlobalErrorCode.METHOD_NOT_ALLOWED.getStatus())
                .body(CommonResponseDto.error(errorResponse));
    }

    @ExceptionHandler(HttpMediaTypeNotAcceptableException.class)
    public ResponseEntity<CommonResponseDto<Object>> handleMediaTypeNotAcceptable(
            HttpMediaTypeNotAcceptableException e) {
        log.error("Media type not acceptable:", e);

        ErrorResponse errorResponse = ErrorResponse.of(
                GlobalErrorCode.MEDIA_TYPE_NOT_ACCEPTABLE,
                "지원하지 않는 미디어 타입입니다."
        );

        return ResponseEntity
                .status(GlobalErrorCode.MEDIA_TYPE_NOT_ACCEPTABLE.getStatus())
                .body(CommonResponseDto.error(errorResponse));
    }
}