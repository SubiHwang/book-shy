package com.ssafy.bookshy.domain.matching.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.ssafy.bookshy.domain.matching.entity.Matching;

public interface MatchingRepository extends JpaRepository<Matching, Long> {

    /**
     * 📚 채팅방 ID를 기반으로 해당 유저가 가진 책 제목을 조회하는 커스텀 쿼리 예시
     * (ChatRoom.id = Matching.matchId 기준으로 연결되었다고 가정)
     */
    @Query("""
        SELECT b.title
        FROM Matching m
        JOIN Books b ON b.id = 
            CASE WHEN :userId = b.ownerId AND b.id = m.bookAId THEN m.bookAId
                 WHEN :userId = b.ownerId AND b.id = m.bookBId THEN m.bookBId
                 ELSE NULL END
        WHERE m.matchId = :chatRoomId
    """)
    String findBookTitleByChatRoomId(@Param("chatRoomId") Long chatRoomId, @Param("userId") Long userId);
}