package com.ssafy.bookshy.domain.library.dto;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.library.entity.Library;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LibraryResponseDto {

    private Long libraryId;
    private Long bookId;
    private Long itemId;
    private String isbn13;
    private String title;
    private String author;
    private String coverImageUrl;
    private boolean isPublic;

    public static LibraryResponseDto from(Library lib) {
        Book book = lib.getBook();
        return LibraryResponseDto.builder()
                .libraryId(lib.getId())
                .bookId(book.getId())
                .itemId(book.getItemId())
                .isbn13(book.getIsbn())
                .title(book.getTitle())
                .author(book.getAuthor())
                .coverImageUrl(book.getCoverImageUrl())
                .isPublic(lib.isPublic())
                .build();
    }
}

