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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;

@Slf4j  // SLF4J 로깅을 위한 어노테이션 추가
@Service
@RequiredArgsConstructor
public class KakaoService {

    private final KakaoConfig kakaoConfig;
    private final UserRepository userRepository;
    private final JsonParser parser = new JsonParser();

    public OAuthUserInfoDto getUserInfo(OAuthTokenDto oAuthTokenDto) {
        log.info("Kakao getUserInfo 호출 시작");

        try {
            String token = oAuthTokenDto.getToken(); //프론트에서 받은 토큰
            log.info("사용하는 토큰: {}", token);

            URL url = new URL(kakaoConfig.getUserInfoUri());
            log.info("요청 URL: {}", url.toString());

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("POST");
            conn.setDoOutput(true);

            conn.setRequestProperty("Authorization", "Bearer " + token);
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

            int responseCode = conn.getResponseCode();
            log.info("응답 코드: {}", responseCode);

            // 응답 헤더 로깅
            log.info("응답 헤더: {}", conn.getHeaderFields());

            // 오류 응답 처리
            if (responseCode >= 400) {
                BufferedReader errorReader = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
                String errorLine;
                StringBuilder errorResult = new StringBuilder();
                while ((errorLine = errorReader.readLine()) != null) {
                    errorResult.append(errorLine);
                }
                log.error("오류 응답: {}", errorResult.toString());
                throw new IOException("API 호출 실패: " + responseCode + ", " + errorResult.toString());
            }

            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line = "";
            StringBuilder result = new StringBuilder();

            while ((line = br.readLine()) != null) {
                result.append(line);
            }

            log.info("API 응답 결과: {}", result);

            JsonElement responseElement = parser.parse(result.toString());
            String email = getStringOrNull(responseElement.getAsJsonObject().get("kakao_account"), "email");
            String nickname = getStringOrNull(responseElement.getAsJsonObject().get("kakao_account").getAsJsonObject().get("profile"), "nickname");
            String profileImageUrl = getStringOrNull(responseElement.getAsJsonObject().get("kakao_account").getAsJsonObject().get("profile"), "profile_image_url");

            log.info("추출된 사용자 정보 - email: {}, nickname: {}, profileImageUrl: {}", email, nickname, profileImageUrl);

            return OAuthUserInfoDto.builder()
                    .email(email)
                    .nickname(nickname)
                    .profileImageUrl(profileImageUrl)
                    .build();

        } catch (MalformedURLException e) {
            log.error("잘못된 URL 형식: {}", e.getMessage(), e);
            throw new GlobalException(GlobalErrorCode.UNDEFINED_URL);
        } catch (ProtocolException e) {
            log.error("잘못된 프로토콜: {}", e.getMessage(), e);
            throw new GlobalException(GlobalErrorCode.UNDEFINED_PROTOCOL);
        } catch (IOException e) {
            log.error("I/O 오류 발생: {}", e.getMessage(), e);
            throw new GlobalException(GlobalErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    private String getStringOrNull(JsonElement element, String fieldName) {
        if (element == null) {
            log.warn("JSON 요소가 null입니다. 필드 이름: {}", fieldName);
            return null;
        }

        JsonElement fieldElement = element.getAsJsonObject().get(fieldName);
        return fieldElement != null ? fieldElement.getAsString() : null;
    }

    public Users read(OAuthUserInfoDto oAuthUserInfoDto) {
        log.info("사용자 조회 시작 - email: {}", oAuthUserInfoDto.getEmail());

        return userRepository.findByEmail(oAuthUserInfoDto.getEmail())
                .orElseThrow(() -> {
                    log.error("사용자를 찾을 수 없음 - email: {}", oAuthUserInfoDto.getEmail());
                    return new GlobalException(UserErrorCode.USER_NOT_FOUND);
                });
    }
}