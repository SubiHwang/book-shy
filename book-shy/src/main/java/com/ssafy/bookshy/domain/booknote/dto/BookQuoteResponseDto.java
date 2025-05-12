package com.ssafy.bookshy.domain.booknote.dto;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.booknote.entity.BookQuote;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookQuoteResponseDto {
    // 도서 정보
    private Long bookId;
    private String title;
    private String author;
    private String description;
    private String publisher;
    private LocalDate pubDate;
    private String coverUrl;

    // 인용구 정보
    private Long quoteId;
    private String content;
    private LocalDateTime createdAt;

    /**
     * ✅ BookQuote와 Book 정보를 조합해 응답 DTO를 생성합니다.
     *
     * @param quote BookQuote와 엔티티
     * @param book Book 엔티티
     * @return BookQuoteResponseDto
     */
    public static BookQuoteResponseDto from(BookQuote quote, Book book) {
        return BookQuoteResponseDto.builder()
                // 📚 도서 정보
                .bookId(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .description(book.getDescription())
                .publisher(book.getPublisher())
                .pubDate(book.getPubDate())
                .coverUrl(book.getCoverImageUrl())

                // 💬 인용구 정보
                .quoteId(quote.getQuoteId())
                .content(quote.getContent())
                .createdAt(quote.getCreatedAt())
                .build();
    }
}
