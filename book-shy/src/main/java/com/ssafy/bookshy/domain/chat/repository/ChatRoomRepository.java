package com.ssafy.bookshy.domain.chat.repository;

import com.ssafy.bookshy.domain.chat.dto.ChatRoomUserIds;
import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.matching.entity.Matching;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    /**
     * 사용자가 참여한 모든 채팅방 조회
     */
    @Query("SELECT r FROM ChatRoom r WHERE r.userAId = :userId OR r.userBId = :userId")
    List<ChatRoom> findByUserId(@Param("userId") Long userId);

    /**
     * 두 사용자의 1:1 채팅방 조회 (있으면 반환)
     */
    @Query("SELECT r FROM ChatRoom r WHERE " +
            "(r.userAId = :userId1 AND r.userBId = :userId2) " +
            "OR (r.userAId = :userId2 AND r.userBId = :userId1)")
    Optional<ChatRoom> findByParticipants(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    /**
     * 특정 날짜에 메시지를 주고받은 채팅방 조회 (거래 캘린더용)
     */
    @Query("SELECT DISTINCT r FROM ChatRoom r " +
            "JOIN r.messages m " +
            "WHERE (r.userAId = :userId OR r.userBId = :userId) " +
            "AND DATE(m.timestamp) = :date")
    List<ChatRoom> findChatRoomsByUserIdAndDate(@Param("userId") Long userId,
                                                @Param("date") LocalDate date);

    Optional<ChatRoom> findByMatching_MatchId(Long matchId);

    /**
     * 🧑‍🤝‍🧑 채팅방 ID로 참여자들의 사용자 ID를 조회합니다 (Native Query).
     *
     * @param chatRoomId 채팅방 ID
     * @return ChatRoomUserIds projection
     */
    @Query(value = """
        SELECT user_a_id AS userAId, user_b_id AS userBId
        FROM chat_room
        WHERE id = :chatRoomId
    """, nativeQuery = true)
    Optional<ChatRoomUserIds> findUserIdsByChatRoomId(@Param("chatRoomId") Long chatRoomId);

    Optional<ChatRoom> findByMatching(Matching matching);
}
