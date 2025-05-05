package com.ssafy.bookshy.domain.exchange.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 거래 약속 리스트 응답 DTO (단건)
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExchangePromiseDto {

    private Long tradeId;

    private String bookTitle;

    private CounterpartDto counterpart;

    private String scheduledTime;

    private String status; // SCHEDULED, CONFIRMED 등

    private TimeLeftDto timeLeft;

    /**
     * 거래 상대 정보 DTO
     */
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CounterpartDto {
        private Long userId;
        private String nickname;
        private String profileImageUrl;
    }
}
