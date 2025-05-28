package com.ssafy.bookshy.domain.exchange.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 거래 약속 리스트 응답 DTO (단건)
 * - 사용자의 관점에서 내가 보유한 도서와 상대방 도서를 구분하여 제공
 * - 상대방 정보, 예정 시간, 상태, 남은 시간 등의 정보를 포함
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({
        "tradeId", "userId", "roomId",
        "type", "status", "scheduledTime", "requestedAt",
        "myBookId", "myBookTitle", "myBookCoverUrl",
        "partnerBookId", "partnerBookTitle", "partnerBookCoverUrl",
        "counterpart", "timeLeft"
})
public class ExchangePromiseDto {

    private Long tradeId;
    private String type;             // EXCHANGE or RENTAL
    private String status;           // PENDING, ACCEPTED, REJECTED, COMPLETED
    private String scheduledTime;    // 예정된 만남 시간
    private String requestedAt;      // 요청 생성 시간

    // ✅ 나의 도서 정보
    private Long myBookId;
    private String myBookTitle;
    private String myBookCoverUrl;

    // ✅ 상대방 도서 정보
    private Long partnerBookId;
    private String partnerBookTitle;
    private String partnerBookCoverUrl;

    // ✅ 거래 상대방 정보
    private CounterpartDto counterpart;

    // ✅ 남은 시간 정보
    private TimeLeftDto timeLeft;

    // ✅ 채팅방 ID 및 상대방 ID
    private Long userId;
    private Long roomId;

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
