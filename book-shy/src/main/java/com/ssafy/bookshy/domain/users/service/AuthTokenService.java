package com.ssafy.bookshy.domain.users.service;

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
        Long userId = jwtProvider.getUserId(jwtTokenDto.getRefreshToken());

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(UserErrorCode.INVALID_USER_ID));

        // 사용자 정보에 리프레시 토큰과 FCM 토큰 업데이트
        user.updateTokens(jwtTokenDto.getRefreshToken(), fcmToken);

        userRepository.save(user);
    }

    public String createNewAccessTokenByValidateRefreshToken(String refreshToken) {
        log.info("💚 AuthTokenService에서 엑세스 토큰 재발행을 위한 refreshToken: {}", refreshToken);
        if (jwtProvider.validateToken(refreshToken)) {
            refreshToken = refreshToken.substring(7);
            return jwtProvider.reissueAccessToken(refreshToken);
        }
        return null;
    }

    public String createNewRefreshTokenByValidateRefreshToken(String refreshToken) {
        if (jwtProvider.validateToken(refreshToken)) {
            refreshToken = refreshToken.substring(7);
            return jwtProvider.reissueAccessToken(refreshToken);
        }
        return null;
    }

}
