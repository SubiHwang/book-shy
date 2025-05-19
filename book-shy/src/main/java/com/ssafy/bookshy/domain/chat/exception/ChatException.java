package com.ssafy.bookshy.domain.chat.exception;

import com.ssafy.bookshy.common.response.BusinessException;
import com.ssafy.bookshy.common.response.ErrorCode;
import com.ssafy.bookshy.domain.users.exception.UserErrorCode;

public class ChatException extends BusinessException {
    public ChatException(ChatErrorCode errorCode) {
        super(errorCode);
    }

}
