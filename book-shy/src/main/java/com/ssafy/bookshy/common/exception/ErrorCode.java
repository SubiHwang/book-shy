package com.ssafy.bookshy.common.exception;

//모든 error enum의 틀
public interface ErrorCode {
    String code();

    String getMessage();

    int getStatus();
}
