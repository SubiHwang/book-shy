package com.ssafy.bookshy.domain.trade.entity;

import com.ssafy.bookshy.common.entity.TimeStampEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "exchange_requests_reviews")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ExchangeRequestReview extends TimeStampEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    private Long requestId;

    private Long reviewerId; // 후기를 남긴 사람
    private Long revieweeId; // 후기를 받은 사람

    private Double rating;
}
