package com.ssafy.bookshy.domain.chat.repository;

import com.ssafy.bookshy.domain.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    /**
     * 채팅방의 메시지를 시간 순으로 조회
     */
    List<ChatMessage> findAllByChatRoomIdOrderByTimestampAsc(Long chatRoomId);
}
