package com.ssafy.bookshy.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatCalendarEventDto {
    private Long calendarId;
    private Long roomId;
    private Long requestId;

    private String title;
    private String description;

    private LocalDateTime exchangeDate;
    private LocalDateTime rentalStartDate;
    private LocalDateTime rentalEndDate;
}
