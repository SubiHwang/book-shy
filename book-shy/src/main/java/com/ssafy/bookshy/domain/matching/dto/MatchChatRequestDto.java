package com.ssafy.bookshy.domain.matching.dto;

import lombok.Data;

@Data
public class MatchChatRequestDto {
    private Long bookAId;
    private Long bookBId;
    private Long receiverId;
}
