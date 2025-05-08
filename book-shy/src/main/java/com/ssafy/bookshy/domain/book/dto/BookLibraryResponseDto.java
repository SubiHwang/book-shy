package com.ssafy.bookshy.domain.book.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.bookshy.domain.book.entity.Book;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BookLibraryResponseDto {
    private String title;
    private String author;
    private String publisher;
    private String coverImageUrl;
    private String description;
    private String pubDate;
    private String category;
    private Integer pageCount;
    private String isbn13;
    private Boolean isLiked;

    @JsonProperty("isPublic")
    private boolean publicYn;

    public static BookLibraryResponseDto from(Book book, boolean isPublic) {
        return BookLibraryResponseDto.builder()
                .title(book.getTitle())
                .author(book.getAuthor())
                .publisher(book.getPublisher())
                .coverImageUrl(book.getCoverImageUrl())
                .description(book.getDescription())
                .pubDate(book.getPubDate() != null ? book.getPubDate().toString() : null)
                .category(book.getCategory())
                .pageCount(book.getPageCount())
                .isbn13(book.getIsbn())
                .publicYn(isPublic)
                .build();
    }

    public static BookLibraryResponseDto from(Book book, boolean isPublic, boolean isLiked) {
        return BookLibraryResponseDto.builder()
                .title(book.getTitle())
                .author(book.getAuthor())
                .publisher(book.getPublisher())
                .coverImageUrl(book.getCoverImageUrl())
                .description(book.getDescription())
                .pubDate(book.getPubDate() != null ? book.getPubDate().toString() : null)
                .category(book.getCategory())
                .pageCount(book.getPageCount())
                .isbn13(book.getIsbn())
                .publicYn(isPublic)
                .isLiked(isLiked)
                .build();
    }
}
