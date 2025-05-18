package com.ssafy.bookshy.domain.matching.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.util.List;

@Data
@Builder
@Getter
public class MatchChatRequestDto {
    private Long senderId;
    private List<Long> myBookId;
    private List<String> myBookName;

    private Long receiverId;
    private List<Long> otherBookId;
    private List<String> otherBookName;
}
