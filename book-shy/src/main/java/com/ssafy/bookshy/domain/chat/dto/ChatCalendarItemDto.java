package com.ssafy.bookshy.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatCalendarItemDto {
    private Long roomId;
    private String date;
    private boolean hasMessage;
}
