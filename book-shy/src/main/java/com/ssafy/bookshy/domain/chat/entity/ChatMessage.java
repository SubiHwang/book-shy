package com.ssafy.bookshy.domain.chat.entity;

import com.ssafy.bookshy.common.entity.TimeStampEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatMessage extends TimeStampEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoom;

    private Long senderId;
    private String content;
    private LocalDateTime timestamp;
    private String type;

    @Column(nullable = false)
    private boolean isRead = false;

    @Column(length = 10) // 이모지는 한 글자이므로 충분한 길이
    private String emoji; // ✅ 단일 이모지만 저장

    @Builder
    public ChatMessage(ChatRoom chatRoom, Long senderId, String content, LocalDateTime timestamp, String type) {
        this.chatRoom = chatRoom;
        this.senderId = senderId;
        this.content = content;
        this.timestamp = timestamp != null ? timestamp : LocalDateTime.now();
        this.type = type;
        this.isRead = false;
        this.emoji = null;
    }

    /**
     * ✅ 이모지를 최초 1회만 추가 가능
     */
    public void addEmoji(String emoji) {
        this.emoji = emoji;
    }

    public void markAsRead() {
        this.isRead = true;
    }
}


