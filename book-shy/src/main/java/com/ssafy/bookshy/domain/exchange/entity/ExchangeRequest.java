package com.ssafy.bookshy.domain.exchange.entity;

import com.ssafy.bookshy.common.entity.TimeStampEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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

    @Column(name = "book_a_id")
    private Long bookAId;

    @Column(name = "book_b_id")
    private Long bookBId;

    @Column(name = "requester_id")
    private Long requesterId;

    @Column(name = "responder_id")
    private Long responderId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "request_status_enum")
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private RequestStatus status;

    @Column(name = "requested_at")
    private LocalDateTime requestedAt;

    @Enumerated(EnumType.STRING)
    private RequestType type;

    // ✅ 거래 상태 ENUM (완료 상태 추가)
    public enum RequestStatus {
        PENDING,
        ACCEPTED,
        REJECTED,
        COMPLETED // 거래 완료 상태 추가
    }

    // 교환/대여 구분 ENUM
    public enum RequestType {
        EXCHANGE,
        RENTAL
    }

    // ✅ JPA 저장 전 기본값 설정
    @PrePersist
    public void prePersist() {
        this.status = this.status == null ? RequestStatus.PENDING : this.status;
        this.requestedAt = this.requestedAt == null ? LocalDateTime.now() : this.requestedAt;
    }

    // ✅ 상태 수정용 Setter (Service에서 사용)
    public void setStatus(RequestStatus status) {
        this.status = status;
    }
}
