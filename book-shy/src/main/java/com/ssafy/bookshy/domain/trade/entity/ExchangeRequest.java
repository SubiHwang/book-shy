package com.ssafy.bookshy.domain.trade.entity;

import com.ssafy.bookshy.common.entity.TimeStampEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "exchange_requests")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ExchangeRequest extends TimeStampEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    private Long bookAId;
    private Long bookBId;

    private Long requesterId;  // 요청자
    private Long responderId;  // 응답자

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    private LocalDateTime requestedAt;

    @Enumerated(EnumType.STRING)
    private RequestType type; // EXCHANGE or RENTAL

    public enum RequestStatus {
        PENDING, ACCEPTED, REJECTED
    }

    public enum RequestType {
        EXCHANGE, RENTAL
    }
}
