package com.ssafy.bookshy.domain.exchange.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExchangeHistoryGroupDto {
    private String yearMonth;
    private List<ExchangeHistoryDto> trades;
}
