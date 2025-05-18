package com.ssafy.bookshy.domain.exchange.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "exchange_reviews_books")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ExchangeReviewBook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id")
    private ExchangeRequestReview review;

    private Long bookId;
    private Long libraryId;
    private Long aladinItemId;

    private boolean fromMatching;
}
