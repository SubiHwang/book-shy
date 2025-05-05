package com.ssafy.bookshy.domain.trade.repository;

import com.ssafy.bookshy.domain.trade.entity.ExchangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Long> {
    boolean existsByBookAIdAndBookBIdAndRequesterIdAndResponderId(Long bookAId, Long bookBId, Long requesterId, Long responderId);
}