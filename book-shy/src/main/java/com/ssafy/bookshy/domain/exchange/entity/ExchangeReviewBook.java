package com.ssafy.bookshy.domain.exchange.entity;

import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequestReview;
import jakarta.persistence.*;
import lombok.*;

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

    // 🔗 어떤 리뷰에서 넘긴 책인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private ExchangeRequestReview review;

    // 📦 도서 정보
    @Column(nullable = false)
    private Long bookId;

    @Column(nullable = false)
    private Long libraryId;

    private Long aladinItemId;

    private boolean fromMatching;

    // 🔑 리뷰를 남긴 사용자 ID
    @Column(nullable = false)
    private Long ownerId;

    // 🔗 거래 요청 ID
    @Column(nullable = false)
    private Long requestId;
}
