package com.ssafy.bookshy.domain.trade.entity;

import com.ssafy.bookshy.common.entity.TimeStampEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "exchange_requests")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ExchangeRequest extends TimeStampEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    private Long bookAId;
    private Long bookBId;
    private Long requesterId;
    private Long responderId;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    private LocalDateTime requestedAt;

    @Enumerated(EnumType.STRING)
    private RequestType type;

    public enum RequestStatus {
        PENDING, ACCEPTED, REJECTED
    }

    public enum RequestType {
        EXCHANGE, RENTAL
    }

    @PrePersist
    public void prePersist() {
        this.status = this.status == null ? RequestStatus.PENDING : this.status;
        this.requestedAt = this.requestedAt == null ? LocalDateTime.now() : this.requestedAt;
    }
}
