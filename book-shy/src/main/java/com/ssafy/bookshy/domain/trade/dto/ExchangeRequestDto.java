package com.ssafy.bookshy.domain.trade.dto;

import lombok.Getter;

@Getter
public class ExchangeRequestDto {
    private Long bookAId;
    private Long bookBId;
    private Long requesterId;
    private Long responderId;

    private String exchangeDate; // ISO8601 문자열
    private String rentalStartDate;
    private String rentalEndDate;

    private Long roomId;
    private String title;
    private String description;
}