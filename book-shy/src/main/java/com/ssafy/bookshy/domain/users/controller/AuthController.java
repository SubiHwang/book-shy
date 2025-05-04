package com.ssafy.bookshy.domain.users.controller;

import com.ssafy.bookshy.domain.users.dto.FcmTokenDto;
import com.ssafy.bookshy.domain.users.dto.JwtTokenDto;
import com.ssafy.bookshy.domain.users.dto.OAuthTokenDto;
import com.ssafy.bookshy.domain.users.service.AuthService;
import com.ssafy.bookshy.domain.users.service.AuthTokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "사용자 인증 관련 API")
public class AuthController {

    private final AuthService authService;
    private final AuthTokenService authTokenService;

//    @PostMapping("/sign-up")
//    @Operation(summary = "회원가입 메서드", description = "사용자가 회원가입을 하기 위한 메서드입니다.")
//    @ApiResponses({
//            @ApiResponse(responseCode = "200", description = "회원가입 성공"),
//            @ApiResponse(responseCode = "400(400-1)", description = "비밀번호 형식 부적합(영문, 숫자, 특수문자를 포함한 8자리 이상)"),
//            @ApiResponse(responseCode = "400(400-2)", description = "닉네임 글자 수 부적합(12자리 이하)"),
//            @ApiResponse(responseCode = "400(409)", description = "이미 존재하는 아이디")
//    })
//    public ResponseEntity<JwtTokenDto> signUp(@RequestBody SignUpDto signUpDto) {
//        JwtTokenDto jwtTokenDto = authService.signUp(signUpDto);
//        return ResponseEntity.ok(jwtTokenDto);
//    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh Token을 이용한 New RefreshToken, New Access Token 발급 메서드", description = "Refresh Token을 이용하여 새로운 Refresh Token, Access Token을 발급 받기 위한 메서드입니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Access Token 재발급 성공"),
            @ApiResponse(responseCode = "400", description = "Access Token 재발급 실패"),
    })
    public ResponseEntity<JwtTokenDto> reissueAccessToken(@RequestHeader("Authorization") String refreshToken, @RequestBody FcmTokenDto deviceTokenDto) {
        String newAccessToken = authTokenService.createNewAccessTokenByValidateRefreshToken(refreshToken);
        String newRefreshToken = authTokenService.createNewRefreshTokenByValidateRefreshToken(refreshToken);

        JwtTokenDto jwtTokenDto = JwtTokenDto.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();

        authTokenService.create(jwtTokenDto, deviceTokenDto.getFcmToken());

        return ResponseEntity.ok(jwtTokenDto);
    }

    @PostMapping("/sign-in/kakao")
    @Operation(summary = "카카오 로그인 메서드", description = "카카오 로그인을 하기 위한 메서드입니다.")
    public ResponseEntity<JwtTokenDto> kakaoSignIn(@RequestBody OAuthTokenDto oAuthTokenDto) {
        JwtTokenDto jwtTokenDto = authService.signIn(oAuthTokenDto);
        return ResponseEntity.ok(jwtTokenDto);

    }

    @PostMapping("/sign-out")
    @Operation(summary = "로그아웃 메서드", description = "사용자가 로그아웃을 하기 위한 메서드입니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "로그인 성공"),
            @ApiResponse(responseCode = "400(401)", description = "존재하지 않는 사용자")
    })
    public ResponseEntity<?> signOut() {
        Long userId = jwtProvider.getUserId(jwtProvider.resolveToken(request).substring(7));
        authService.signOut(userId);
        return ResponseEntity.ok(null);
    }


}
