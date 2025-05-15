package com.ssafy.bookshy.domain.book.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.JsonNode;
import com.ssafy.bookshy.domain.book.entity.Book;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@Builder
public class BookListResponseDto {

    private Long itemId;
    private String title;
    private String author;
    private String publisher;
    private String category;
    private String coverImageUrl;
    private String description;
    private Boolean isLiked;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Boolean inLibrary;

    public static BookListResponseDto from(JsonNode node) {
        return BookListResponseDto.builder()
                .itemId(node.path("itemId").asLong())
                .title(node.path("title").asText(null))
                .author(node.path("author").asText(null))
                .publisher(node.path("publisher").asText(null))
                .coverImageUrl(node.path("cover").asText(null))
                .description(node.path("description").asText(null))
                .build();
    }

    public static BookListResponseDto from(Book book, Boolean isLiked) {
        return BookListResponseDto.builder()
                .itemId(book.getItemId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .publisher(book.getPublisher())
                .category(book.getCategory())
                .coverImageUrl(book.getCoverImageUrl())
                .description(book.getDescription())
                .isLiked(isLiked)
                .inLibrary(null)
                .build();
    }
}
