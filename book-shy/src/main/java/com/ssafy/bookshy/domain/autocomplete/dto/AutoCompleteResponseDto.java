package com.ssafy.bookshy.domain.autocomplete.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AutoCompleteResponseDto { //redis에서 가져온 거 직렬화
    private List<AutoCompleteItem> items;
}
