package com.ssafy.bookshy.domain.matching.repository;

import com.ssafy.bookshy.domain.matching.entity.Matching;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface MatchingRepository extends JpaRepository<Matching, Long> {

    // 📌 사용자가 참여한 매칭 모두 조회
    @Query("""
        SELECT m FROM Matching m
        WHERE EXISTS (
            SELECT 1 FROM Library l
            WHERE l.book.id = m.bookAId AND l.user.userId = :userId
        )
        OR EXISTS (
            SELECT 1 FROM Library l
            WHERE l.book.id = m.bookBId AND l.user.userId = :userId
        )
    """)
    List<Matching> findByUserId(Long userId);
}