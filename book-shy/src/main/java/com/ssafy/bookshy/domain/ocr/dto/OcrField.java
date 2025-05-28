package com.ssafy.bookshy.domain.ocr.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OcrField {
    private String text;   // inferText
    private int x;         // 좌측 상단 X
    private int y;         // 좌측 상단 Y
    private int h;         // 높이 (폰트 크기 추정용)
}
