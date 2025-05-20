package com.ssafy.bookshy.domain.chat.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "📋 거래 일정 등록 요청 DTO")
public class ChatCalendarCreateRequestDto {

    @Schema(description = "📦 채팅방 ID", example = "1", required = true)
    private Long roomId;

    @Schema(description = "📚 거래 유형 (EXCHANGE 또는 RENTAL)", example = "EXCHANGE", required = true)
    private String type;

    @Schema(description = "📝 일정 제목", example = "🌟 어린왕자 ↔ 총균쇠 교환", required = true)
    private String title;

    @Schema(description = "🗒️ 일정 설명 (선택)", example = "4층 카페에서 만나기로 했어요")
    private String description;

    @Schema(description = "📆 교환일 (EXCHANGE 타입일 경우 필수)", example = "2025-05-30T14:00:00")
    private String eventDate;

    @Schema(description = "🔐 대여 시작일 (RENTAL 타입일 경우 필수)", example = "2025-06-01T00:00:00")
    private String startDate;

    @Schema(description = "🔓 대여 종료일 (RENTAL 타입일 경우 필수)", example = "2025-06-08T00:00:00")
    private String endDate;

    @Schema(description = "👥 사용자 ID 배열 (요청자와 응답자)", example = "[101, 202]", required = true)
    private List<Long> userIds;

    @Schema(description = "📗 요청자의 책 ID", example = "3001", required = true)
    private Long bookAId;

    @Schema(description = "📘 응답자의 책 ID", example = "3002", required = true)
    private Long bookBId;
}
