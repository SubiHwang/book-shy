package com.ssafy.bookshy.domain.trade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TradeHistoryGroupDto {
    private String yearMonth;
    private List<TradeHistoryDto> trades;
}
