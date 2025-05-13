package com.ssafy.bookshy.domain.booktrip.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "book_trip")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BookTrip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tripId;

    private Long bookId;

    private Long userId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private LocalDateTime createdAt;

    @Builder
    public BookTrip(Long bookId, Long userId, String content) {
        this.bookId = bookId;
        this.userId = userId;
        this.content = content;
        this.createdAt = LocalDateTime.now();
    }

    public void updateContent(String content) {
        this.content = content;
    }
}
