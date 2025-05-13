package com.ssafy.bookshy.domain.trending.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "키워드 정보")
public class TrendingResponse {
    @Schema(description = "검색어", example = "날씨")
    @JsonProperty("keyword")
    private String keyword;

    @Schema(description = "순위", example = "1")
    @JsonProperty("rank")
    private int rank;

    @Schema(description = "인기도", example = "UP")
    @JsonProperty("trend")
    private Trend trend;
}
