package com.ssafy.bookshy.domain.library.exception;

import com.ssafy.bookshy.common.response.BusinessException;

public class LibraryException extends BusinessException {
    public LibraryException(LibraryErrorCode errorCode) {
        super(errorCode);
    }
}
