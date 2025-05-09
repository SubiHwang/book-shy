package com.ssafy.bookshy.domain.chat.entity;

import com.ssafy.bookshy.common.entity.TimeStampEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatRoom extends TimeStampEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_a_id")
    private Long userAId;

    @Column(name = "user_b_id")
    private Long userBId;

    private LocalDateTime createdAt;

    private String lastMessage;              // ✅ 마지막 메시지
    private LocalDateTime lastMessageTimestamp; // ✅ 마지막 메시지 시간

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatMessage> messages = new ArrayList<>();

    public ChatRoom(Long userAId, Long userBId) {
        this.userAId = userAId;
        this.userBId = userBId;
        this.createdAt = LocalDateTime.now();
    }

    // ✅ 채팅 메시지 저장 후 마지막 메시지 업데이트
    public void updateLastMessage(String content, LocalDateTime timestamp) {
        this.lastMessage = content;
        this.lastMessageTimestamp = timestamp;
    }

    @Builder
    public ChatRoom(Long id) {
        this.id = id;
    }
}
