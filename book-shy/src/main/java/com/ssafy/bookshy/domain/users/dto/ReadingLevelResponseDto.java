package com.ssafy.bookshy.domain.users.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReadingLevelResponseDto {
    private int readCount;         // 총 읽은 권수
    private String height;         // 대략적 높이 (문자열)
    private String stageMessage;   // 현재 단계 설명
}
