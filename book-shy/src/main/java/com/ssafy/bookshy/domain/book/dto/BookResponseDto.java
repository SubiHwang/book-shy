package com.ssafy.bookshy.domain.book.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.ssafy.bookshy.domain.book.entity.Book;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookResponseDto {


    private String title;
    private String author;
    private String publisher;
    private String coverImageUrl;
    private String description;
    private String pubDate;
    private String category;
    private Integer pageCount;
    private Boolean isLiked;

    @Schema(description = "ISBN13 (13자리 국제 표준 도서번호)")
    private String isbn13;

    public static BookResponseDto fromAladin(JsonNode node, Boolean isLiked) {

        if (node == null || node.isNull()) {
            return BookResponseDto.builder()
                    .isLiked(isLiked)
                    .build();
        }

        try {
            // pageCount 계산용 정보 추출
            JsonNode info = node.has("bookinfo") ? node.path("bookinfo") : node.path("subInfo");
            Integer pages = null;

            if (info != null && !info.isMissingNode()) {
                int rawPage = info.path("itemPage").asInt(0);
                if (rawPage > 0) {
                    pages = rawPage;
                }
            }

            return BookResponseDto.builder()
                    .title         (node.path("title").asText(null))
                    .author        (node.path("author").asText(null))
                    .publisher     (node.path("publisher").asText(null))
                    .coverImageUrl (node.path("cover").asText(null))
                    .description   (node.path("description").asText(null))
                    .pubDate       (node.path("pubDate").asText(null))
                    .category      (extractMiddleCategory(node.path("categoryName").asText(null))) // ✅ 수정됨
                    .pageCount     (pages)
                    .isbn13        (node.path("isbn13").asText(null))
                    .isLiked(isLiked)
                    .build();
        } catch (Exception e) {
            System.out.println("❌ fromAladin 파싱 실패: " + e.getMessage());
            return BookResponseDto.builder()
                    .title(node.path("title").asText(null))
                    .author(node.path("author").asText(null))
                    .isbn13(node.path("isbn13").asText(null))
                    .build();
        }
    }

    public static BookResponseDto fromAladin(JsonNode node) {
        return fromAladin(node, false);
    }

    public static BookResponseDto from(Book book, boolean isPublic) {
        return BookResponseDto.builder()
                .title(book.getTitle())
                .author(book.getAuthor())
                .publisher(book.getPublisher())
                .coverImageUrl(book.getCoverImageUrl())
                .description(book.getDescription())
                .pubDate(book.getPubDate() != null ? book.getPubDate().toString() : null)
                .category(book.getCategory())
                .pageCount(book.getPageCount())
                .isbn13(book.getIsbn())
                .build();
    }

    public static BookResponseDto from(Book book, boolean isPublic, boolean isLiked) {
        return BookResponseDto.builder()
                .title(book.getTitle())
                .author(book.getAuthor())
                .publisher(book.getPublisher())
                .coverImageUrl(book.getCoverImageUrl())
                .description(book.getDescription())
                .pubDate(book.getPubDate() != null ? book.getPubDate().toString() : null)
                .category(book.getCategory())
                .pageCount(book.getPageCount())
                .isbn13(book.getIsbn())
                .isLiked(isLiked)
                .build();
    }

    private static String extractMiddleCategory(String category) {
        if (category == null || !category.contains(">")) return null;
        String[] parts = category.split(">");
        return parts.length >= 3 ? parts[1] : (parts.length == 2 ? parts[1] : null);
    }
}
