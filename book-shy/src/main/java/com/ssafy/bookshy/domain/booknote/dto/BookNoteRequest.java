package com.ssafy.bookshy.domain.booknote.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "📘 독후감 작성 요청 DTO")
public class BookNoteRequest {

    @Schema(description = "작성자 ID", example = "1")
    private Long userId;

    @Schema(description = "도서 ID", example = "101")
    private Long bookId;

    @Schema(description = "독후감 내용", example = "이 책은 내 삶을 바꿨어요! 😊")
    private String content;
}