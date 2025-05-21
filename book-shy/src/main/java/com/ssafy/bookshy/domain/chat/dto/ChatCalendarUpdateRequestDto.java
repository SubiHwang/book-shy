package com.ssafy.bookshy.domain.chat.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatCalendarUpdateRequestDto {

    @Schema(description = "일정 ID", example = "42", required = true)
    private Long calendarId;

    @Schema(description = "거래 요청 ID", example = "1005", required = true)
    private Long requestId;

    @Schema(description = "거래 유형", example = "EXCHANGE", required = true)
    private String type;

    @Schema(description = "일정 제목", example = "📘 교환 일정 변경")
    private String title;

    @Schema(description = "거래 설명 메모", example = "만나는 장소 변경했어요")
    private String description;

    @Schema(description = "교환일", example = "2025-06-02T15:00:00")
    private String exchangeDate;

    @Schema(description = "대여 시작일", example = "2025-06-01T00:00:00")
    private String startDate;

    @Schema(description = "대여 종료일", example = "2025-06-11T00:00:00")
    private String endDate;
}
