package com.ssafy.bookshy.domain.chat.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatCalendarCreateRequestDto {

    private Long roomId;            // 📦 채팅방 ID
    private Long requestId;         // 🔄 교환 요청 ID
    private String type;            // 📚 거래 유형 ("EXCHANGE", "RENTAL")

    private String title;           // 📝 일정 제목
    private String description;     // 🗒️ 설명 (선택)

    private String eventDate;       // 📆 교환일 (EXCHANGE 전용)
    private String startDate;       // 🔐 대여 시작일 (RENTAL 전용)
    private String endDate;         // 🔓 대여 종료일 (RENTAL 전용)

    private List<Long> userIds;
    private Long bookAId;
    private Long bookBId;
}
