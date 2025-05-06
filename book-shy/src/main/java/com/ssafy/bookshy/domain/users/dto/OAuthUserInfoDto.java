package com.ssafy.bookshy.domain.users.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class OAuthUserInfoDto {
    private String email;
    private String nickname;
    private String profileImageUrl;
}
