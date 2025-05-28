package com.ssafy.bookshy.external.aladin;

import com.ssafy.bookshy.common.response.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AladinErrorCode implements ErrorCode {

    INVALID_QUERY(400, "검색어를 입력해 주세요."),
    NO_SEARCH_RESULT(404, "검색 결과가 없습니다. 다른 키워드를 시도해 보세요."),
    ITEM_NOT_FOUND(404, "요청하신 도서를 찾을 수 없습니다."),
    API_CALL_FAILED(500, "도서 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."),
    INVALID_RESPONSE_FORMAT(500, "도서 정보를 처리하는 중 문제가 발생했습니다. 관리자에게 문의해 주세요.");

    private final int status;
    private final String message;
}
