package com.ssafy.bookshy.kafka.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 📦 교환 완료 이벤트 DTO (Kafka 토픽: trade.success)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "📦 도서 교환 완료 Kafka 이벤트 DTO")
public class TradeSuccessDto {

    @Schema(description = "교환 요청 ID", example = "300")
    private Long requestId;

    @Schema(description = "요청자 ID", example = "1")
    private Long requesterId;

    @Schema(description = "응답자 ID", example = "2")
    private Long responderId;

    @Schema(description = "교환된 책 A ID", example = "101")
    private Long bookIdA;

    @Schema(description = "교환된 책 B ID", example = "202")
    private Long bookIdB;

    @Schema(description = "교환 완료 시각 (ISO-8601)", example = "2025-05-01T15:00:00")
    private String completedAt;
}
