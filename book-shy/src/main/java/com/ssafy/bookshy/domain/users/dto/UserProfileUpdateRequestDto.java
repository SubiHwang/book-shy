package com.ssafy.bookshy.domain.users.dto;

import com.ssafy.bookshy.domain.users.entity.Users.Gender;
import lombok.Getter;

@Getter
public class UserProfileUpdateRequestDto {
    private String nickname;
    private Gender gender;
    private String address;
    private Double latitude;
    private Double longitude;
}