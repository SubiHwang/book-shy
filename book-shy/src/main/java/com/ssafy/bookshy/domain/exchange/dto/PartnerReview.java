package com.ssafy.bookshy.domain.exchange.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "🤝 상대방 리뷰 상태 정보")
public class PartnerReview {

    @Schema(description = "상대방이 리뷰를 제출했는지 여부", example = "true")
    private boolean hasSubmitted;

    @Schema(description = "제출 일시 (제출하지 않았으면 null)", example = "2024-03-21T16:00:00", nullable = true)
    private LocalDateTime submittedAt;
}