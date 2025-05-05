package com.ssafy.bookshy.domain.trade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TradeHistoryDto {

    private Long tradeId;
    private String counterpartNickname;
    private String counterpartProfileImageUrl;

    private String place;
    private LocalDateTime completedAt;

    private String receivedBookTitle;
    private String receivedBookAuthor;
    private String receivedBookCoverUrl;

    public static TradeHistoryDto fromEntity(Trade trade) {
        return TradeHistoryDto.builder()
                .tradeId(trade.getId())
                .counterpartNickname(trade.getCounterpart().getNickname())
                .counterpartProfileImageUrl(trade.getCounterpart().getProfileImageUrl())
                .place(trade.getPlace())
                .completedAt(trade.getCompletedAt())
                .receivedBookTitle(trade.getReceivedBook().getTitle())
                .receivedBookAuthor(trade.getReceivedBook().getAuthor())
                .receivedBookCoverUrl(trade.getReceivedBook().getCoverImageUrl())
                .build();
    }
}
