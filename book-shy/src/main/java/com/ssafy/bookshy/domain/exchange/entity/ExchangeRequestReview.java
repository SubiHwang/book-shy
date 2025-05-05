package com.ssafy.bookshy.domain.exchange.entity;

import com.ssafy.bookshy.common.entity.TimeStampEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exchange_requests_reviews")
@Getter
@Builder
@AllArgsConstructor
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
