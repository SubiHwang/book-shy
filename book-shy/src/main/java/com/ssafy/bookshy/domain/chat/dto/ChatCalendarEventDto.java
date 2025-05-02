package com.ssafy.bookshy.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * 채팅방 거래 약속 캘린더 이벤트 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatCalendarEventDto {
    private Long chatRoomId;
    private Long partnerId;
    private String partnerName;
    private LocalDate date;  // 거래 예정일 등
}
