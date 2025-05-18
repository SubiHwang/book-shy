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

    private Long reviewerId;
    private Long revieweeId;

    private Double rating;

    private int condition;
    private int punctuality;
    private int manner;
}
