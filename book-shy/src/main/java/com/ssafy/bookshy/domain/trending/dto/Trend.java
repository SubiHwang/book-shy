package com.ssafy.bookshy.domain.trending.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "트렌드 상태")
public enum Trend {
    @Schema(description = "상승")
    UP,

    @Schema(description = "하락")
    DOWN,

    @Schema(description = "유지")
    STEADY
}