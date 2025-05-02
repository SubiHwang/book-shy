package com.ssafy.bookshy.domain.book.dto;

import com.ssafy.bookshy.domain.book.entity.Book;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookResponseDto {
    private Long bookId;
    private String title;
    private String author;
    private String coverImageUrl;
    private String status;

    public static BookResponseDto from(Book book) {
        return BookResponseDto.builder()
                .bookId(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .coverImageUrl(book.getCoverImageUrl())
                .status(book.getStatus().name())
                .build();
    }
}