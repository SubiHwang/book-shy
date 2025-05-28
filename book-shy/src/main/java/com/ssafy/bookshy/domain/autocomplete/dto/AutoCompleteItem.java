package com.ssafy.bookshy.domain.autocomplete.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AutoCompleteItem {

    private String keyword;


    private SearchType type;

    public enum SearchType {
        BOOK,   // 책 제목
        AUTHOR  // 작가명
    }
}
