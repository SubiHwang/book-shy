package com.ssafy.bookshy.domain.recommend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

import java.util.Map;

@Getter
public class RecommendMessageKafkaDto {

    @Schema(description = "이벤트 유형 (SEARCH, WISHLIST, BOOK_VIEW 등)", example = "SEARCH")
    private String eventType;  // "SEARCH", "WISHLIST", "BOOK_VIEW" 등

    @Schema(description = "이벤트 상세 데이터", example = "{\"query\": \"헤르만 헤세\"}")
    private Map<String, Object> eventData;  // 이벤트별 상세 데이터

    @Schema(description = "이벤트 발생 시간 (ISO 형식)", example = "2023-11-15T14:30:00.000Z")
    private String timestamp;  // ISO 날짜 포맷 (클라이언트에서 생성)
}
