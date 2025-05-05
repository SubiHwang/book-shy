package com.ssafy.bookshy.domain.trade.repository;

import com.ssafy.bookshy.domain.trade.entity.ExchangeRequestReview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExchangeRequestReviewRepository extends JpaRepository<ExchangeRequestReview, Long> {
    boolean existsByRequestIdAndReviewerId(Long requestId, Long reviewerId);
}