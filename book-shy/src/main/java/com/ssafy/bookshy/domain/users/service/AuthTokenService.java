package com.ssafy.bookshy.domain.users.service;

import com.ssafy.bookshy.common.exception.GlobalException;
import com.ssafy.bookshy.domain.users.dto.JwtTokenDto;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.exception.UserErrorCode;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthTokenService {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    @Transactional
    public void create(JwtTokenDto jwtTokenDto, String fcmToken) {
        Long userId = jwtProvider.getUserId(jwtTokenDto.getRefreshToken());

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new GlobalException(UserErrorCode.INVALID_USER_ID));

        // 사용자 정보에 리프레시 토큰과 FCM 토큰 업데이트
        user.setRefreshToken(jwtTokenDto.getRefreshToken());
        user.setFcmToken(fcmToken);

        userRepository.save(user);
    }

    public String createNewAccessTokenByValidateRefreshToken(String refreshToken) {
        if (jwtProvider.validateToken(refreshToken)) {
            refreshToken = refreshToken.substring(7);
            return jwtProvider.reissueAccessToken(refreshToken);
        }
        return null;
    }

    public String createNewRefreshTokenByValidateRefreshToken(String refreshToken) {
        if (jwtProvider.validateToken(refreshToken)) {
            refreshToken = refreshToken.substring(7);
            return jwtProvider.generateRefreshToken(jwtProvider.getUsername(refreshToken), jwtProvider.getUserId(refreshToken));
        }
        return null;
    }

}
