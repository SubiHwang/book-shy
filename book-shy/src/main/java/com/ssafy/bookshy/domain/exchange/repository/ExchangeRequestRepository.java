package com.ssafy.bookshy.domain.exchange.repository;

import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Long> {
    boolean existsByBookAIdAndBookBIdAndRequesterIdAndResponderId(Long bookAId, Long bookBId, Long requesterId, Long responderId);

    /**
     * 로그인한 사용자가 참여했고, 완료된 교환 요청 목록을 조회합니다.
     *
     * @param userId 사용자 ID
     * @param pageable 페이징 정보
     * @return 완료된 교환 요청 리스트
     */
    @Query("""
        SELECT e
        FROM ExchangeRequest e
        WHERE e.status = 'ACCEPTED'
          AND (e.requesterId = :userId OR e.responderId = :userId)
        ORDER BY e.requestedAt DESC
    """)
    List<ExchangeRequest> findCompletedByUser(Long userId, Pageable pageable);
}