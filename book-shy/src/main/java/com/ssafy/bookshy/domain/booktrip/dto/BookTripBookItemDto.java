package com.ssafy.bookshy.domain.booktrip.dto;

import com.ssafy.bookshy.domain.booktrip.entity.BookTrip;
import com.ssafy.bookshy.domain.book.entity.Book;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookTripBookItemDto {
    private Long tripId;
    private Long userId;
    private Long bookId;
    private String title;
    private String author;
    private String coverImageUrl;
    private String content;
    private LocalDateTime createdAt;
    private boolean hasTrip;
    private boolean mine;
    private UserProfile userProfile;

    public static BookTripBookItemDto from(BookTrip trip, Book book, String nickname, String profileImageUrl) {
        return BookTripBookItemDto.builder()
                .tripId(trip.getTripId())
                .userId(trip.getUserId())
                .bookId(trip.getBookId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .coverImageUrl(book.getCoverImageUrl())
                .content(trip.getContent())
                .createdAt(trip.getCreatedAt())
                .hasTrip(true)
                .mine(true)
                .userProfile(new UserProfile(nickname, profileImageUrl))
                .build();
    }

    @Getter
    @AllArgsConstructor
    public static class UserProfile {
        private String nickname;
        private String profileImageUrl;
    }
}
