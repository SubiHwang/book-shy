package com.ssafy.bookshy.domain.matching.dto;

import com.ssafy.bookshy.domain.users.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NearbyUserResponseDto {
    private Long userId;
    private String nickname;
    private String profileImageUrl;
    private String address;
    private Double distance;

    public NearbyUserResponseDto(Users user, double distance) {
        this.userId = user.getUserId();
        this.nickname = user.getNickname();
        this.profileImageUrl = user.getProfileImageUrl();
        this.address = user.getAddress();
        this.distance =  Math.round(distance * 100.0) / 100.0;
    }
}
