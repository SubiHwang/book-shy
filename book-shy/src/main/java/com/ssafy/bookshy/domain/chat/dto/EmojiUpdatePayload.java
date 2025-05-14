package com.ssafy.bookshy.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EmojiUpdatePayload {
    private Long messageId;
    private String emoji;   // null이면 삭제
    private String type;    // "ADD" or "REMOVE"
    private Long updatedBy; // 이모지 추가/삭제한 사용자 ID
}
