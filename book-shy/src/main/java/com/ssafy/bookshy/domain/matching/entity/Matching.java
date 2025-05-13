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

    @Column(name = "book_a_id", nullable = false)
    private Long bookAId;

    @Column(name = "book_b_id", nullable = false)
    private Long bookBId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    @Builder.Default
    private Status status = Status.PENDING;

    @Column(name = "matched_at")
    private LocalDateTime matchedAt;

    public enum Status {
        PENDING,  // 대기 중
        ACCEPTED, // 수락됨
        REJECTED  // 거절됨
    }

    public void updateStatus(Status status) {
        this.status = status;
    }

}
