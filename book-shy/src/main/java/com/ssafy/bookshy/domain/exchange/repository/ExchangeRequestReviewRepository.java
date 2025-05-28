package com.ssafy.bookshy.domain.exchange.repository;

import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequestReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 📝 교환 리뷰 정보를 관리하는 Repository입니다.
 */
@Repository
public interface ExchangeRequestReviewRepository extends JpaRepository<ExchangeRequestReview, Long> {

    /**
     * 🔍 특정 거래 요청(requestId)과 작성자(reviewerId)를 기준으로 리뷰 1건 조회
     *
     * @param requestId   거래 요청 ID
     * @param reviewerId  리뷰 작성자 ID
     * @return 리뷰 정보 (Optional)
     */
    Optional<ExchangeRequestReview> findByRequestIdAndReviewerId(Long requestId, Long reviewerId);

    /**
     * 📦 특정 거래 요청(requestId)에 작성된 모든 리뷰 목록 조회
     *
     * @param requestId 거래 요청 ID
     * @return 리뷰 리스트
     */
    List<ExchangeRequestReview> findByRequestId(Long requestId);

    /**
     * 🔄 리뷰 중복 여부 확인용
     *
     * @param requestId  거래 요청 ID
     * @param reviewerId 리뷰 작성자 ID
     * @return 존재 여부
     */
    boolean existsByRequestIdAndReviewerId(Long requestId, Long reviewerId);
}
