package com.ssafy.bookshy.domain.users.dto;

import com.ssafy.bookshy.domain.users.entity.Users;
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
    private float bookShyScore;
    private String badge;
    private String profileImageUrl;
    private String address;
    private int age;
    private Users.Gender gender;

    public static UserProfileResponseDto from(Users user) {

        return UserProfileResponseDto.builder()
                .nickname(user.getNickname())
                .bookShyScore(user.getTemperature() != null ? user.getTemperature() : 0)
                .badge(user.getBadges() != null ? user.getBadges() : "북끄북끄 입문자")
                .profileImageUrl(user.getProfileImageUrl())
                .address(user.getAddress())
                .age(user.getAge())
                .gender(user.getGender())
                .build();
    }
}


