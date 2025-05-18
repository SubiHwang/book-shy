package com.ssafy.bookshy.domain.autocomplete.exception;

import com.ssafy.bookshy.common.response.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AutoCompletionErrorCode implements ErrorCode {
    // 검색어 관련 에러
    QUERY_TOO_SHORT(400, "검색어는 최소 1자 이상이어야 합니다."),
    QUERY_TOO_LONG(400, "검색어는 최대 50자까지 입력 가능합니다."),
    INVALID_CHARACTERS(400, "검색어에 허용되지 않는 문자가 포함되어 있습니다."),

    // 결과 관련 에러
    NO_RESULTS_FOUND(404, "검색 결과가 없습니다."),
    TOO_MANY_RESULTS(429, "너무 많은 결과가 검색되었습니다. 더 구체적으로 검색해주세요."),

    // 서버 관련 에러
    AUTOCOMPLETE_SERVICE_UNAVAILABLE(503, "자동완성 서비스가 일시적으로 사용 불가능합니다."),
    CACHE_ERROR(500, "캐시 조회 중 오류가 발생했습니다."),
    DATABASE_ERROR(500, "데이터베이스 조회 중 오류가 발생했습니다."),

    // 요청 제한 관련 에러
    RATE_LIMIT_EXCEEDED(429, "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요."),

    // 타임아웃 관련 에러
    SEARCH_TIMEOUT(408, "검색 시간이 초과되었습니다."),

    // 권한 관련 에러
    UNAUTHORIZED_ACCESS(401, "자동완성 기능 사용 권한이 없습니다."),

    // 설정 관련 에러
    INVALID_LANGUAGE_CODE(400, "유효하지 않은 언어 코드입니다."),
    INVALID_SEARCH_TYPE(400, "유효하지 않은 검색 타입입니다.");

    private final int status;
    private final String message;

}
