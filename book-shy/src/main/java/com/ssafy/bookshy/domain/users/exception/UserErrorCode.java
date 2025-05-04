package com.ssafy.bookshy.domain.users.exception;

import com.ssafy.bookshy.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserErrorCode implements ErrorCode {

    // 사용자 관련 에러
    INVALID_USER_ID(400, "유효하지 않은 사용자 ID입니다."),
    USER_NOT_FOUND(404, "사용자를 찾을 수 없습니다."),
    PROFILE_FETCH_FAILED(500, "프로필 정보를 가져오는데 실패했습니다.");

    private final int status;
    private final String message;

    @Override
    public String code() {
        return name();
    }

}
