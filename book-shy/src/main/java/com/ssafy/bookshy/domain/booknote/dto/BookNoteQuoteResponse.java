package com.ssafy.bookshy.domain.booknote.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookNoteQuoteResponse {
    private Long reviewId;         // 등록된 독후감 ID
    private Long quoteId;          // 등록된 인용구 ID
    private String status;         // ex) "SUCCESS"
    private String message;        // ex) "독후감과 인용구가 성공적으로 등록되었습니다."
}
