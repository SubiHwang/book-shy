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

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoom;

    private Long senderId;
    private String content;
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private boolean isRead = false; // ✅ 읽음 여부 필드 추가

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> emojis = new ArrayList<>();

    @Builder
    public ChatMessage(ChatRoom chatRoom, Long senderId, String content, LocalDateTime timestamp) {
        this.chatRoom = chatRoom;
        this.senderId = senderId;
        this.content = content;
        this.timestamp = timestamp != null ? timestamp : LocalDateTime.now();
        this.isRead = false; // 메시지 생성 시 기본값 false
    }

    public void addEmoji(String emoji) {
        this.emojis.add(emoji);
    }

    public void markAsRead() {
        this.isRead = true;
    }
}

