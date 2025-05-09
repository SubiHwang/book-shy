package com.ssafy.bookshy.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 클라이언트가 WebSocket을 통해 보낼 때 사용하는 메시지 요청 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageRequestDto {
    private Long chatRoomId;   // 채팅방 ID
    private Long senderId;     // 보낸 사람 ID
    private String content;    // 메시지 본문
    private String type;    // 메시지 타입
}
