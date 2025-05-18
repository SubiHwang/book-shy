package com.ssafy.bookshy.domain.library.exception;

import com.ssafy.bookshy.common.response.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum LibraryErrorCode implements ErrorCode {

    // 🧑 사용자 관련
    USER_NOT_FOUND(404, "사용자를 찾을 수 없습니다."),

    // 📚 도서 관련
    BOOK_NOT_FOUND(404, "해당 도서를 찾을 수 없습니다."),
    BOOK_ALREADY_EXISTS(400, "이미 존재하는 도서입니다."),
    BOOK_CREATE_FAILED(500, "도서 등록에 실패했습니다."),
    INVALID_BOOK_STATUS(400, "잘못된 도서 상태입니다."),

    // 📕 ISBN / ItemId 관련
    INVALID_ISBN(400, "유효하지 않은 ISBN입니다."),
    ITEM_ID_NOT_FOUND(404, "해당 Item ID의 도서를 찾을 수 없습니다."),

    // 📘 서재 관련
    DUPLICATE_LIBRARY_ENTRY(400, "이미 서재에 등록된 도서입니다."),
    LIBRARY_NOT_FOUND(404, "서재 항목이 존재하지 않습니다."),

    // 🖼 이미지 처리
    IMAGE_UPLOAD_FAILED(500, "표지 이미지 저장에 실패했습니다."),

    // 📅 날짜 파싱
    INVALID_PUB_DATE(400, "출판일 형식이 잘못되었습니다.");

    private final int status;
    private final String message;
}
