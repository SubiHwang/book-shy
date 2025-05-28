package com.ssafy.bookshy.domain.exchange.exception;

import com.ssafy.bookshy.common.response.BusinessException;

public class ExchangeException extends BusinessException {
    public ExchangeException(ExchangeErrorCode errorCode) {
        super(errorCode);
    }

}
