package com.ssafy.bookshy.kafka.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

/**
 * Kafka에서 결제 성공 이벤트를 수신할 DTO (엘라스틱 서치에 저장될 모든 정보 포함)
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class MatchSuccessDto {
    private String transactionId;
    private long buyerId;
    private long sellerId;
    private String userJob;
    private long birthDate;
    private BigDecimal totalAmount;
    private String currency;
    private String paymentCategory;
    private String paymentMerchant;
    private String storeName;
    private int cardId;
    private String cardName;
    private int year;   // 예: 2025
    private int month;  // 예: 3
    private int day;    // 예: 28
    private boolean receiptUploaded;
    private String paymentStatus;
    private OffsetDateTime createdAt;
    private List<OrderDetail> orders;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    @Builder
    public static class OrderDetail {
        private String orderId;
        private String cardNumber;
        private BigDecimal amount;
        private String paymentOrderStatus;
    }
}
