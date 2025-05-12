package com.ssafy.bookshy.domain.booknote.dto;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.booknote.entity.BookNote;
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

    /**
     * ✅ BookNote와 Book 정보를 조합해 응답 DTO를 생성합니다.
     *
     * @param note BookNote 엔티티
     * @param book Book 엔티티
     * @return BookNoteResponseDto
     */
    public static BookNoteResponseDto from(BookNote note, Book book) {
        return BookNoteResponseDto.builder()
                .reviewId(note.getReviewId())
                .bookId(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .description(book.getDescription())
                .publisher(book.getPublisher())
                .pubDate(book.getPubDate())
                .coverUrl(book.getCoverImageUrl())
                .content(note.getContent())
                .createdAt(note.getCreatedAt())
                .build();
    }
}
