package com.ssafy.bookshy.domain.booknote.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookNoteQuoteUpdateRequest {
    private String reviewContent;
    private String quoteContent;
}
