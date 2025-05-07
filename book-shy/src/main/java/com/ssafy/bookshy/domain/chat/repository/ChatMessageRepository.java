package com.ssafy.bookshy.domain.chat.repository;

import com.ssafy.bookshy.domain.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    /**
     * 채팅방의 메시지를 시간 순으로 조회
     */
    List<ChatMessage> findAllByChatRoomIdOrderByTimestampAsc(Long chatRoomId);

    /**
     * ✅ 안 읽은 메시지 개수 조회
     */
    @Query("""
        SELECT COUNT(m)
        FROM ChatMessage m
        WHERE m.chatRoom.id = :roomId
          AND m.senderId <> :userId
          AND m.isRead = false
    """)
    int countUnreadMessages(@Param("roomId") Long roomId, @Param("userId") Long userId);

    /**
     * ✅ 안 읽은 메시지 목록 조회 (읽음 처리용)
     */
    @Query("""
        SELECT m
        FROM ChatMessage m
        WHERE m.chatRoom.id = :roomId
          AND m.senderId <> :userId
          AND m.isRead = false
    """)
    List<ChatMessage> findUnreadMessages(@Param("roomId") Long roomId, @Param("userId") Long userId);
}

