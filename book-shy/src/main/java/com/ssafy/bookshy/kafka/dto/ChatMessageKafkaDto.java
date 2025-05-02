package com.ssafy.bookshy.kafka.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatMessageKafkaDto {
    private Long chatRoomId;
    private Long senderId;
    private String content;
}
