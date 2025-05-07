package com.ssafy.bookshy.domain.booknote.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookNoteResponseDto {
    // 도서 정보
    private Long bookId;
    private String title;
    private String author;
    private String description;
    private String publisher;
    private LocalDate pubDate;
    private String coverUrl;

    // 독후감 정보
    private Long reviewId;
    private String content;
    private LocalDateTime createdAt;
}