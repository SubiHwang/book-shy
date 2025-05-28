package com.ssafy.bookshy.domain.book.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class BookListTotalResponseDto {
    private int total;
    private List<BookListResponseDto> books;
}
