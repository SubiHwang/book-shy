package com.ssafy.bookshy.kafka.dto;

import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 💬 실시간 채팅 메시지 Kafka 이벤트 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "💬 실시간 채팅 Kafka 이벤트 DTO")
public class ChatMessageKafkaDto {

    @Schema(description = "채팅방 ID", example = "1")
    private Long chatRoomId;

    @Schema(description = "보낸 사용자 ID", example = "1")
    private Long senderId;

    @Schema(description = "메시지 내용", example = "안녕하세요!")
    private String content;

    @Schema(description = "메시지 타입", example = "chat")
    private String type;
}
