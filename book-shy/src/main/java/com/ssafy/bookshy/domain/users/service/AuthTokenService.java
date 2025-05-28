package com.ssafy.bookshy.domain.users.service;

import com.ssafy.bookshy.common.exception.JwtErrorCode;
import com.ssafy.bookshy.common.exception.JwtException;
import com.ssafy.bookshy.common.jwt.JwtProvider;
import com.ssafy.bookshy.domain.users.dto.JwtTokenDto;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.exception.UserErrorCode;
import com.ssafy.bookshy.domain.users.exception.UserException;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthTokenService {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    @Transactional
    public void create(JwtTokenDto jwtTokenDto, String fcmToken) {

        log.info("📍 재발행을 위한 새 토큰 - accessToken: {}, refreshToken: {}",
                jwtTokenDto.getAccessToken(), jwtTokenDto.getRefreshToken());

        Long userId = jwtProvider.getUserId(jwtTokenDto.getRefreshToken());

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(UserErrorCode.INVALID_USER_ID));

        // 사용자 정보에 리프레시 토큰과 FCM 토큰 업데이트
        user.updateTokens(jwtTokenDto.getRefreshToken(), fcmToken);

        userRepository.save(user);
    }

    public String createNewAccessTokenByValidateRefreshToken(String refreshToken) {
        try {
            log.info("💚 AuthTokenService에서 엑세스 토큰 재발행을 위한 refreshToken: {}", refreshToken);

            // 토큰 유효성 검증
            if (!jwtProvider.validateToken(refreshToken)) {
                log.error("리프레시 토큰이 유효하지 않습니다");
                throw new JwtException(JwtErrorCode.REFRESH_NOT_VALID);
            }

            // Bearer 제거 (만약 validateToken에서 이미 제거하지 않는다면)
            if (refreshToken.startsWith("Bearer ")) {
                refreshToken = refreshToken.substring(7);
            }

            String newAccessToken = jwtProvider.reissueAccessToken(refreshToken);

            if (newAccessToken == null || newAccessToken.isEmpty()) {
                log.error("새 액세스 토큰 생성 실패");
                throw new JwtException(JwtErrorCode.TOKEN_GENERATION_FAILED);
            }

            return newAccessToken;
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            log.error("리프레시 토큰이 만료되었습니다: {}", e.getMessage());
            throw new JwtException(JwtErrorCode.EXPIRED_TOKEN);
        } catch (Exception e) {
            log.error("토큰 재발급 중 오류 발생: {}", e.getMessage(), e);
            throw new JwtException(JwtErrorCode.TOKEN_PROCESSING_ERROR);
        }
    }

    public String createNewRefreshTokenByValidateRefreshToken(String refreshToken) {
        if (jwtProvider.validateToken(refreshToken)) {
            refreshToken = refreshToken.substring(7);
            return jwtProvider.reissueAccessToken(refreshToken);
        }
        return null;
    }

}
