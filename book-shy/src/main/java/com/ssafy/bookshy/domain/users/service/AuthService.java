package com.ssafy.bookshy.domain.users.service;

import com.ssafy.bookshy.common.jwt.JwtProvider;
import com.ssafy.bookshy.domain.users.dto.JwtTokenDto;
import com.ssafy.bookshy.domain.users.dto.OAuthTokenDto;
import com.ssafy.bookshy.domain.users.dto.OAuthUserInfoDto;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final OAuthService oAuthService;
    private final AuthTokenService uAuthTokenService;
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;


    /**
     * 로그인
     *
     * @param oAuthTokenDto
     * @return
     */
    public JwtTokenDto signIn(OAuthTokenDto oAuthTokenDto, String redirect) {

        OAuthUserInfoDto oAuthUserInfoDto = oAuthService.getUserInfo(oAuthTokenDto, redirect);

        //회원가입 안 한 유저일 경우 -> 자동 회원가입
        Users user = userRepository.findByEmail(oAuthUserInfoDto.getEmail())
                .orElseGet(() -> registerNewUser(oAuthUserInfoDto));

        JwtTokenDto jwtTokenDto = generateJwtTokenDto(user);
        uAuthTokenService.create(jwtTokenDto, oAuthTokenDto.getFcmToken());
        return jwtTokenDto;

    }

    private Users registerNewUser(OAuthUserInfoDto oAuthUserInfoDto) {
        // 존재하지 않을 경우 -> 회원 가입 -> 로그인
        Users newUser = Users.builder()
                .email(oAuthUserInfoDto.getEmail())
                .nickname(oAuthUserInfoDto.getNickname())
                .profileImageUrl(oAuthUserInfoDto.getProfileImageUrl())
                .build();
        return userRepository.save(newUser);
    }


    /**
     * JWT 토큰 생성
     *
     * @param user
     * @return
     */
    private JwtTokenDto generateJwtTokenDto(Users user) {
        String accessToken = jwtProvider.generateToken(user.getNickname(), user.getUserId());
        String refreshToken = jwtProvider.generateRefreshToken(user.getNickname(), user.getUserId());

        JwtTokenDto jwtTokenDto = JwtTokenDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();

        return jwtTokenDto;
    }

    public void signOut(Long userId) {
    }
}
