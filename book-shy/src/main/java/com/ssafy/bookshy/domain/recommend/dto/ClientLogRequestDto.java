package com.ssafy.bookshy.domain.recommend.dto;

import com.ssafy.bookshy.kafka.dto.RecommendMessageKafkaDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "📱 클라이언트 이벤트 로깅 요청 DTO")
public class ClientLogRequestDto {
    @Schema(description = "이벤트 유형", example = "SEARCH")
    private String eventType;

    @Schema(description = "이벤트 상세 데이터", example = "{\"query\": \"헤르만 헤세\"}")
    private Map<String, Object> eventData;

    @Schema(description = "이벤트 발생 시간", example = "2023-11-15T14:30:00.000Z")
    private String timestamp;

    // RecommendMessageKafkaDto로 변환하는 메서드
    public RecommendMessageKafkaDto toKafkaDto() {
        return RecommendMessageKafkaDto.builder()
                .eventType(this.eventType)
                .eventData(this.eventData)
                .timestamp(this.timestamp)
                .build();
    }

}