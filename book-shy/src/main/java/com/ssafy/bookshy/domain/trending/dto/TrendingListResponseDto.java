package com.ssafy.bookshy.domain.trending.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class TrendingListResponseDto {

    private List<TrendingResponse> trendingResponseList;

}
