package com.ssafy.bookshy.domain.matching.exception;

import com.ssafy.bookshy.common.response.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MatchingErrorCode implements ErrorCode {

    // 사용자 관련
    USER_NOT_FOUND(404, "사용자를 찾을 수 없습니다."),
    SAME_USER_MATCH_NOT_ALLOWED(400, "자기 자신과는 매칭할 수 없습니다."),

    // 매칭 관련
    MATCHING_NOT_FOUND(404, "매칭 정보를 찾을 수 없습니다."),
    MATCHING_ALREADY_EXISTS(400, "이미 해당 사용자와 매칭이 존재합니다."),

    // 채팅방 관련
    CHAT_ROOM_ALREADY_EXISTS(400, "이미 채팅방이 존재합니다."),
    CHAT_ROOM_CREATION_FAILED(500, "채팅방 생성에 실패했습니다."),

    // 요청 관련
    INVALID_MATCH_REQUEST(400, "잘못된 매칭 요청입니다."),
    INVALID_BOOK_SELECTION(400, "도서 선택 정보가 올바르지 않습니다."),

    // 거리 기반 필터링
    USER_LOCATION_NOT_SET(400, "사용자의 위치 정보가 설정되어 있지 않습니다."),
    DISTANCE_EXCEEDED(400, "거리가 매칭 허용 범위를 초과했습니다.");

    private final int status;
    private final String message;
}
