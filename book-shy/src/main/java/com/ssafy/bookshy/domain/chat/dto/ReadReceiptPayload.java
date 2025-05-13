package com.ssafy.bookshy.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ReadReceiptPayload {
    private final List<Long> messageIds;
    private final Long readerId;
}

