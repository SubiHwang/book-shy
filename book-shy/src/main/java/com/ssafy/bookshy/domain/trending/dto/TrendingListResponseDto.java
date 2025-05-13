package com.ssafy.bookshy.domain.trending.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class TrendingListResponseDto {

    @Schema(description = "급상승 검색어 목록")
    @JsonProperty("trendingKeywords")
    private List<TrendingResponse> trendingResponseList;

}
