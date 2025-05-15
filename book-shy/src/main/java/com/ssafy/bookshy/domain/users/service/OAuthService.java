package com.ssafy.bookshy.domain.users.service;

import com.ssafy.bookshy.domain.users.dto.OAuthTokenDto;
import com.ssafy.bookshy.domain.users.dto.OAuthUserInfoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OAuthService {

    private final KakaoService kakaoService;

    /**
     * @param oAuthTokenDto
     * @return
     */
    public OAuthUserInfoDto getUserInfo(OAuthTokenDto oAuthTokenDto, String redirect) {
        String kakaoAccessToken = kakaoService.getKakaoAccessTokenForUser(oAuthTokenDto.getToken(), redirect);
        return kakaoService.getUserInfo(kakaoAccessToken);
    }

}
