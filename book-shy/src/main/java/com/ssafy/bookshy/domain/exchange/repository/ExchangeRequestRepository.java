package com.ssafy.bookshy.domain.exchange.repository;

import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Long> {

    /**
     * 두 사용자와 책으로 구성된 교환 요청이 이미 존재하는지 여부를 확인합니다.
     *
     * @param bookAId       요청자 책 ID
     * @param bookBId       응답자 책 ID
     * @param requesterId   요청자 ID
     * @param responderId   응답자 ID
     * @return 존재 여부 (true/false)
     */
    boolean existsByBookAIdAndBookBIdAndRequesterIdAndResponderId(Long bookAId, Long bookBId, Long requesterId, Long responderId);

    /**
     * ✅ 완료된 교환 요청 목록 조회
     * - 상태가 ACCEPTED인 교환 요청만 조회합니다.
     * - 내가 요청자이거나 응답자인 거래만 포함됩니다.
     * - 최신 거래 순으로 정렬합니다.
     *
     * @param userId   로그인 사용자 ID
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
    List<ExchangeRequest> findCompletedByUser(@Param("userId") Long userId, Pageable pageable);

    /**
     * 📅 예정된 거래 약속(약속 상태: PENDING 또는 ACCEPTED) 목록 조회
     * - 내가 요청자 또는 응답자인 거래만 포함됩니다.
     * - 거래가 아직 완료되지 않았으며, 시간 약속이 필요한 상태입니다.
     * - 최신 요청 순으로 정렬합니다.
     *
     * @param userId   로그인 사용자 ID
     * @param pageable 페이징 정보
     * @return 예정된 교환 요청 리스트
     */
    @Query("""
        SELECT e
        FROM ExchangeRequest e
        WHERE (e.requesterId = :userId OR e.responderId = :userId)
          AND e.status IN ('PENDING', 'ACCEPTED')
        ORDER BY e.requestedAt DESC
    """)
    List<ExchangeRequest> findPromiseByUserId(@Param("userId") Long userId, Pageable pageable);
}
