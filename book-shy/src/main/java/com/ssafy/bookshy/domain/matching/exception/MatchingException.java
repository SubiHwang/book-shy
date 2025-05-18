package com.ssafy.bookshy.domain.matching.exception;

import com.ssafy.bookshy.common.response.BusinessException;

public class MatchingException extends BusinessException {
    public MatchingException(MatchingErrorCode errorCode) {
        super(errorCode);
    }
}
