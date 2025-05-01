package com.ssafy.bookshy.kafka.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 📘 책 등록 이벤트 DTO (Kafka 토픽: book.created)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "📘 책 등록 Kafka 이벤트 DTO")
public class BookCreatedDto {

    @Schema(description = "도서 ID", example = "101")
    private Long bookId;

    @Schema(description = "도서 제목", example = "데미안")
    private String title;

    @Schema(description = "저자", example = "헤르만 헤세")
    private String author;

    @Schema(description = "등록 사용자 ID", example = "1")
    private Long userId;
}