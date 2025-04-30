package com.ssafy.bookshy.domain.booknote.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookQuoteRequest {
    private Long userId;
    private Long bookId;
    private String content;
}
