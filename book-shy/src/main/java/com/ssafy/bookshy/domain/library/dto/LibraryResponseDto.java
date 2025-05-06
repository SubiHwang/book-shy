package com.ssafy.bookshy.domain.library.dto;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.library.entity.Library;
import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LibraryResponseDto {

    private Long libraryId;
    private Long aladinItemId;
    private String isbn13;
    private String title;
    private String author;
    private String coverImageUrl;
    private boolean isPublic;

    public static LibraryResponseDto from(Library lib) {
        Book book = lib.getBook();
        return LibraryResponseDto.builder()
                .libraryId(lib.getId())
                .aladinItemId(lib.getBook().getAladinItemId())
                .isbn13(book.getIsbn())
                .title(book.getTitle())
                .author(book.getAuthor())
                .coverImageUrl(lib.getBook().getCoverImageUrl())
                .isPublic(lib.isPublic())
                .build();
    }
}
