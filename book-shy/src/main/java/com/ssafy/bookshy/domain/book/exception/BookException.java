package com.ssafy.bookshy.domain.book.exception;

import com.ssafy.bookshy.common.response.BusinessException;

public class BookException extends BusinessException {
    public BookException(BookErrorCode errorCode) {
        super(errorCode);
    }
}
