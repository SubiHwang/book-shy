package com.ssafy.bookshy.domain.book.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "books")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id")
    private Long id;

    private Long aladinItemId;

    @Column(nullable = false)
    private String isbn;

    @Column(nullable = false)
    private String title;

    private String author;
    private String translator;
    private String publisher;

    private LocalDate pubDate;
    private String coverImageUrl;

    private String description;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime createdAt;
    private Integer exchangeCount;

    public enum Status {
        AVAILABLE,
        EXCHANGING,
        EXCHANGED
    }
}