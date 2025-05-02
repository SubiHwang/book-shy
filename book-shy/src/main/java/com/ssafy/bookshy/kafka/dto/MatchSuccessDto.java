package com.ssafy.bookshy.kafka.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 🤝 매칭 성공 이벤트 DTO (Kafka 토픽: match.success)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "🤝 매칭 성공 Kafka 이벤트 DTO")
public class MatchSuccessDto {

    @Schema(description = "매칭 ID", example = "150")
    private Long matchId;

    @Schema(description = "사용자 A ID", example = "1")
    private Long userAId;

    @Schema(description = "사용자 B ID", example = "2")
    private Long userBId;

    @Schema(description = "사용자 A 책 ID", example = "101")
    private Long bookAId;

    @Schema(description = "사용자 B 책 ID", example = "202")
    private Long bookBId;

    @Schema(description = "매칭 완료 시각 (ISO-8601)", example = "2025-05-01T14:00:00")
    private String matchedAt;
}