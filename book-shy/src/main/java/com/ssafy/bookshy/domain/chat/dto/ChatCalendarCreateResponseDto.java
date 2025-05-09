package com.ssafy.bookshy.domain.chat.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatCalendarCreateResponseDto {
    private Long eventId;
    private String status;
    private String message;
}
