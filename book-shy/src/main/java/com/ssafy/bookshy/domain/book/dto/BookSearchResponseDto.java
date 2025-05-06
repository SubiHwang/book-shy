package com.ssafy.bookshy.domain.book.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class BookSearchResponseDto {
    private int total;
    private List<BookResponseDto> books;

    public static BookSearchResponseDto from(List<BookResponseDto> books) {
        return BookSearchResponseDto.builder()
                .total(books.size())
                .books(books)
                .build();
    }
}
