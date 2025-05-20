package com.ssafy.bookshy.domain.exchange.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ExchangeSummaryDto {
    private int peopleCount; // 교환한 사람 수
    private int bookCount;   // 교환한 책 수
}
