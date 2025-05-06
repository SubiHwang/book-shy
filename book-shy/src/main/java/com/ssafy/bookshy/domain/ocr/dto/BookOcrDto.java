package com.ssafy.bookshy.domain.ocr.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookOcrDto {
    private String title;
    private String author;
    private String translator;
    private String publisher;
}