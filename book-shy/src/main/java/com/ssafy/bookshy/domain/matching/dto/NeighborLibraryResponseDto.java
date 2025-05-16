package com.ssafy.bookshy.domain.matching.dto;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.library.entity.Library;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class NeighborLibraryResponseDto {
    private Long userId;
    private String nickname;
    private List<BookWithLikeDto> books;

    @Getter
    @Builder
    public static class BookWithLikeDto {
        private Long libraryId;
        private Long bookId;
        private Long itemId;
        private String isbn13;
        private String title;
        private String author;
        private String coverImageUrl;
        private Boolean isLiked;

        public static BookWithLikeDto from(Library lib, boolean isLiked) {
            Book book = lib.getBook();
            return BookWithLikeDto.builder()
                    .libraryId(lib.getId())
                    .bookId(book.getId())
                    .itemId(book.getItemId())
                    .isbn13(book.getIsbn())
                    .title(book.getTitle())
                    .author(book.getAuthor())
                    .coverImageUrl(book.getCoverImageUrl())
                    .isLiked(isLiked)
                    .build();
        }
    }
}
