package com.ssafy.bookshy.domain.exchange.repository;

import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequestReview;
import com.ssafy.bookshy.domain.exchange.entity.ExchangeReviewBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 📚 교환 리뷰에 포함된 도서 정보를 관리하는 Repository입니다.
 * - 각 리뷰에 포함된 개별 도서들을 저장/조회하는 용도로 사용됩니다.
 */
@Repository
public interface ExchangeReviewBookRepository extends JpaRepository<ExchangeReviewBook, Long> {

    /**
     * 🔍 특정 리뷰에 포함된 모든 도서 정보를 조회합니다.
     *
     * @param review 리뷰 엔티티
     * @return 해당 리뷰에 포함된 도서 리스트
     */
    List<ExchangeReviewBook> findByReview(ExchangeRequestReview review);

    /**
     * 🔍 리뷰 ID 기반으로 해당 리뷰에 포함된 도서들을 조회합니다.
     * (엔티티 없이 ID만 사용할 경우 활용 가능)
     *
     * @param reviewId 리뷰 ID
     * @return 도서 정보 리스트
     */
    List<ExchangeReviewBook> findByReview_ReviewId(Long reviewId);

    /**
     * ❌ 리뷰와 연관된 모든 도서 정보 삭제
     *
     * @param review 리뷰 엔티티
     */
    void deleteByReview(ExchangeRequestReview review);

    /**
     * 🔍 거래 요청 ID(requestId)로 연결된 모든 리뷰 도서를 조회합니다.
     *
     * @param requestId 거래 요청 ID
     * @return 해당 요청에 포함된 모든 도서 리뷰 정보
     */
    List<ExchangeReviewBook> findByRequestId(Long requestId);
}
