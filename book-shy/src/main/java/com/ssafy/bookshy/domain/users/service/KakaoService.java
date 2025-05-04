package com.ssafy.bookshy.domain.users.service;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.ssafy.bookshy.common.exception.GlobalErrorCode;
import com.ssafy.bookshy.common.exception.GlobalException;
import com.ssafy.bookshy.domain.users.config.KakaoConfig;
import com.ssafy.bookshy.domain.users.dto.OAuthTokenDto;
import com.ssafy.bookshy.domain.users.dto.OAuthUserInfoDto;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.exception.UserErrorCode;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;

@Service
@RequiredArgsConstructor
public class KakaoService {

    private final KakaoConfig kakaoConfig;
    private final UserRepository userRepository;
    private final JsonParser parser = new JsonParser();

    public OAuthUserInfoDto getUserInfo(OAuthTokenDto oAuthTokenDto) {

        try {
            String token = oAuthTokenDto.getToken(); //프론트에서 받은 토큰


            URL url = new URL(kakaoConfig.getUserInfoUri());

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("POST");
            conn.setDoOutput(true);

            conn.setRequestProperty("Authorization", "Bearer " + token);

            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line = "";
            String result = "";

            while ((line = br.readLine()) != null) {
                result += line;
            }

            JsonElement responseElement = parser.parse(result);
            String email = getStringOrNull(responseElement.getAsJsonObject().get("kakao_account"), "email");
            String nickname = getStringOrNull(responseElement.getAsJsonObject().get("kakao_account").getAsJsonObject().get("profile"), "nickname");
            String profileImageUrl = getStringOrNull(responseElement.getAsJsonObject().get("kakao_account").getAsJsonObject().get("profile"), "picture");


            return OAuthUserInfoDto.builder()
                    .email(email)
                    .nickname(nickname)
                    .profileImageUrl(profileImageUrl)
                    .build();

        } catch (MalformedURLException e) {
            throw new GlobalException(GlobalErrorCode.UNDEFINED_URL);
        } catch (ProtocolException e) {
            throw new GlobalException(GlobalErrorCode.UNDEFINED_PROTOCOL);
        } catch (IOException e) {
            throw new GlobalException(GlobalErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    private String getStringOrNull(JsonElement element, String fieldName) {
        JsonElement fieldElement = element.getAsJsonObject().get(fieldName);
        return fieldElement != null ? fieldElement.getAsString() : null;
    }

    public Users read(OAuthUserInfoDto oAuthUserInfoDto) {
        // 이메일로 회원 조회
        return userRepository.findByEmail(oAuthUserInfoDto.getEmail())
                .orElseThrow(() -> new GlobalException(UserErrorCode.USER_NOT_FOUND));
    }

}
