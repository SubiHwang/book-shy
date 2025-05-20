package com.ssafy.bookshy.domain.chat.dto;

import com.ssafy.bookshy.domain.chat.entity.ChatCalendar;
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

    private String type; // 🔹 추가: "EXCHANGE" or "RENTAL"

    public static ChatCalendarEventDto from(ChatCalendar entity) {
        return ChatCalendarEventDto.builder()
                .calendarId(entity.getCalendarId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .exchangeDate(entity.getExchangeDate())
                .rentalStartDate(entity.getRentalStartDate())
                .rentalEndDate(entity.getRentalEndDate())
                .roomId(entity.getChatRoom().getId())
                .requestId(entity.getRequestId())
                .type(determineType(entity)) // 🔹 type 필드 설정
                .build();
    }

    private static String determineType(ChatCalendar entity) {
        if (entity.getExchangeDate() != null) {
            return "EXCHANGE";
        } else if (entity.getRentalStartDate() != null && entity.getRentalEndDate() != null) {
            return "RENTAL";
        } else {
            return "UNKNOWN";
        }
    }
}
