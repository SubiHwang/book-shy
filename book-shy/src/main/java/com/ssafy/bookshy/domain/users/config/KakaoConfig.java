package com.ssafy.bookshy.domain.users.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Component
public class KakaoConfig {

    //프론트엔드에게 받은 토큰으로 정보를 요청하는 uri
    @Value("${oauth.kakao.user-info-uri}")
    private String userInfoUri;

}
