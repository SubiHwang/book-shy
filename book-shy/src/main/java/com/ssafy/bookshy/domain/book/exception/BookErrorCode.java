package com.ssafy.bookshy.domain.book.exception;

import com.ssafy.bookshy.common.response.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum BookErrorCode implements ErrorCode {

    // 📚 Book 관련
    BOOK_NOT_FOUND(404, "해당 도서를 찾을 수 없습니다."),
    BOOK_ALREADY_EXISTS(400, "이미 존재하는 도서입니다."),
    BOOK_CREATE_FAILED(500, "도서를 등록하는 중 오류가 발생했습니다."),
    INVALID_BOOK_STATUS(400, "도서 상태 정보가 올바르지 않습니다."),

    // 💖 Wish 관련
    ALREADY_WISHED(400, "이미 찜한 도서입니다."),
    WISH_NOT_FOUND(404, "찜한 도서를 찾을 수 없습니다."),

    // 📕 ISBN / ItemId 관련
    INVALID_ISBN(400, "유효하지 않은 ISBN입니다."),
    ITEM_ID_NOT_FOUND(404, "해당 Item ID의 도서를 찾을 수 없습니다."),

    // 🧑 사용자 관련
    USER_NOT_FOUND(404, "사용자를 찾을 수 없습니다."),

    // 📅 날짜 파싱
    INVALID_PUB_DATE(400, "출판일 정보가 잘못되었습니다. 다시 확인해 주세요.");

    private final int status;
    private final String message;
}
