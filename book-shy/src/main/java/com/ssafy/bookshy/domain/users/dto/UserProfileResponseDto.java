package com.ssafy.bookshy.domain.users.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 📦 마이페이지 사용자 프로필 응답 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponseDto {
    private String nickname;
    private int booksyScore;
    private String badge;
    private String profileImageUrl;
}
