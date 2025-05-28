package com.ssafy.bookshy.common.exception;

import com.ssafy.bookshy.common.response.BusinessException;

public class JwtException extends BusinessException {

    public JwtException(JwtErrorCode errorCode) {
        super(errorCode);
    }
}
