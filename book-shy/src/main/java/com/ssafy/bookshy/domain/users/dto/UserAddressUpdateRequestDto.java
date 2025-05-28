package com.ssafy.bookshy.domain.users.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserAddressUpdateRequestDto {

    @Schema(description = "주소", example = "서울특별시 강남구 역삼동")
    private String address;

    @Schema(description = "위도", example = "37.5012743", nullable = true)
    private Double latitude;

    @Schema(description = "경도", example = "127.039585", nullable = true)
    private Double longitude;
}
