package com.ssafy.bookshy.domain.book.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookListResponseDto {

    private Long itemId;
    private String title;
    private String author;
    private String publisher;
    private String coverImageUrl;
    private String description;

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
}
