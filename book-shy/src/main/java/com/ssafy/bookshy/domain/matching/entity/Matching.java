package com.ssafy.bookshy.domain.matching.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "matching")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Matching {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "match_id")
    private Long matchId;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.ACCEPTED;

    @Column(name = "matched_at")
    private LocalDateTime matchedAt;

    @Column(name = "sender_id")
    private Long senderId;

    @Column(name = "receiver_id")
    private Long receiverId;

    public enum Status {
        ACCEPTED
    }
}
