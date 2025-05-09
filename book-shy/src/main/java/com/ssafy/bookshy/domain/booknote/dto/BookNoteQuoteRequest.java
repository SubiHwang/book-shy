package com.ssafy.bookshy.domain.booknote.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookNoteQuoteRequest {
    private Long userId;           // 👤 작성자 ID
    private Long bookId;           // 📚 도서 ID
    private String reviewContent;  // 📝 독후감 내용
    private String quoteContent;   // 💬 인용구 문장
}
