package com.ssafy.bookshy.domain.exchange.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 남은 시간 DTO (days, hours, minutes, label 포함)
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeLeftDto {
    private int days;
    private int hours;
    private int minutes;
    private String display;
}
