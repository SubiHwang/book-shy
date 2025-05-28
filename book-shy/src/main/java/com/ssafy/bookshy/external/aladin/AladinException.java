package com.ssafy.bookshy.external.aladin;

import com.ssafy.bookshy.common.response.BusinessException;

public class AladinException extends BusinessException {
    public AladinException(AladinErrorCode errorCode) {
        super(errorCode);
    }
}
