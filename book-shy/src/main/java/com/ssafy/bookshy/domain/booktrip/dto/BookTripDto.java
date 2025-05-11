package com.ssafy.bookshy.domain.booktrip.dto;

import com.ssafy.bookshy.domain.booktrip.entity.BookTrip;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookTripDto {
    private Long tripId;
    private Long userId;
    private Long bookId;
    private String content;
    private LocalDateTime createdAt;

    public static BookTripDto from(BookTrip trip) {
        return BookTripDto.builder()
                .tripId(trip.getTripId())
                .userId(trip.getUserId())
                .bookId(trip.getBookId())
                .content(trip.getContent())
                .createdAt(trip.getCreatedAt())
                .build();
    }
}

