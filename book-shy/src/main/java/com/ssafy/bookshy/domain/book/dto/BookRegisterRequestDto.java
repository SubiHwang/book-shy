package com.ssafy.bookshy.domain.book.dto;

import com.ssafy.bookshy.domain.book.entity.Book;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookRegisterRequestDto {
    private Long aladinItemId;
    private String isbn;
    private String title;
    private String author;
    private String translator;
    private String publisher;
    private LocalDate pubDate;
    private String coverImageUrl;
    private String description;
}