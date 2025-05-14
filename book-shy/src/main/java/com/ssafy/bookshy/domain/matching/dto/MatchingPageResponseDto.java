package com.ssafy.bookshy.domain.matching.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class MatchingPageResponseDto {

    private int totalPages;
    private int currentPage;
    private long results;
    private List<MatchingDto> candidates;
}
