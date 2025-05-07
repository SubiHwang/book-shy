package com.ssafy.bookshy.domain.library.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class LibrarySearchAddRequestDto {
    private Long userId;
    private Long itemId; // Aladin 도서 고유 ID
}
