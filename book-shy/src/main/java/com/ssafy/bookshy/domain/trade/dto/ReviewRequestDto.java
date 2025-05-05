package com.ssafy.bookshy.domain.trade.dto;

import lombok.Getter;

@Getter
public class ReviewRequestDto {
    private Long requestId;
    private Long reviewerId;
    private Long revieweeId;
    private Double rating;
}