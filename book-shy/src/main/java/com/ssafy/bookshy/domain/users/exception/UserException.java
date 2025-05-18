package com.ssafy.bookshy.domain.users.exception;

import com.ssafy.bookshy.common.response.BusinessException;

public class UserException extends BusinessException {
    public UserException(UserErrorCode errorCode) {
        super(errorCode);
    }
}
