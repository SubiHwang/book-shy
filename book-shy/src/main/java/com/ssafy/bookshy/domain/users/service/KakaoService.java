package com.ssafy.bookshy.domain.users.service;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.ssafy.bookshy.common.exception.GlobalErrorCode;
import com.ssafy.bookshy.common.exception.GlobalException;
import com.ssafy.bookshy.domain.users.config.KakaoConfig;
import com.ssafy.bookshy.domain.users.dto.OAuthUserInfoDto;
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
    private final JsonParser parser = new JsonParser();

    public OAuthUserInfoDto getUserInfo(String kakaoAccessToken) {
        log.info("Kakao getUserInfo 호출 시작");

        try {
            String token = kakaoAccessToken; //프론트에서 받은 토큰
            log.info("사용하는 토큰: {}", token);

            URL url = new URL(kakaoConfig.getUserInfoUri());
            log.info("요청 URL: {}", url);

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
                throw new IOException("API 호출 실패: " + responseCode + ", " + errorResult);
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

    public String getKakaoAccessToken(String authorizationCode) {
        log.info("카카오 액세스 토큰 발급 시작 - 인가 코드: {}", authorizationCode);

        try {
            URL url = new URL("https://kauth.kakao.com/oauth/token");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            // POST 요청 설정
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);

            // 요청 헤더 설정
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

            // 요청 파라미터 설정
            StringBuilder params = new StringBuilder();
            params.append("grant_type=authorization_code");
            params.append("&client_id=").append(kakaoConfig.getClientId());
            params.append("&redirect_uri=").append(kakaoConfig.getRedirectUri());
            params.append("&code=").append(authorizationCode);

            // 클라이언트 시크릿이 있다면 추가
            if (kakaoConfig.getClientSecret() != null && !kakaoConfig.getClientSecret().isEmpty()) {
                params.append("&client_secret=").append(kakaoConfig.getClientSecret());
            }

            // 요청 본문 작성
            try (var wr = new OutputStreamWriter(conn.getOutputStream())) {
                wr.write(params.toString());
                wr.flush();
            }

            // 응답 코드 확인
            int responseCode = conn.getResponseCode();
            log.info("토큰 요청 응답 코드: {}", responseCode);

            // 응답 데이터 읽기
            StringBuilder response = new StringBuilder();
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(responseCode >= 400 ? conn.getErrorStream() : conn.getInputStream()))) {
                String line;
                while ((line = br.readLine()) != null) {
                    response.append(line);
                }
            }

            // 응답 결과 로깅
            if (responseCode >= 400) {
                log.error("토큰 발급 실패 - 응답: {}", response.toString());
                throw new IOException("카카오 토큰 발급 실패: " + responseCode + ", " + response.toString());
            }

            log.info("토큰 발급 응답: {}", response.toString());

            // 응답 JSON 파싱
            JsonElement element = JsonParser.parseString(response.toString());

            String accessToken = element.getAsJsonObject().get("access_token").getAsString();
            String refreshToken = element.getAsJsonObject().has("refresh_token") ?
                    element.getAsJsonObject().get("refresh_token").getAsString() : null;
            String tokenType = element.getAsJsonObject().get("token_type").getAsString();
            Long expiresIn = element.getAsJsonObject().get("expires_in").getAsLong();

            log.info("발급된 액세스 토큰: {}", accessToken);

            return OAuthTokenDto.builder()
                    .token(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType(tokenType)
                    .expiresIn(expiresIn)
                    .build();

        } catch (MalformedURLException e) {
            log.error("잘못된 URL 형식: {}", e.getMessage(), e);
            throw new GlobalException(GlobalErrorCode.UNDEFINED_URL);
        } catch (IOException e) {
            log.error("토큰 발급 중 I/O 오류: {}", e.getMessage(), e);
            throw new GlobalException(GlobalErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}