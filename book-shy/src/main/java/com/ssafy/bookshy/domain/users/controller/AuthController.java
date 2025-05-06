package com.ssafy.bookshy.domain.users.controller;

import com.ssafy.bookshy.common.jwt.JwtProvider;
import com.ssafy.bookshy.domain.users.dto.FcmTokenDto;
import com.ssafy.bookshy.domain.users.dto.JwtTokenDto;
import com.ssafy.bookshy.domain.users.dto.OAuthTokenDto;
import com.ssafy.bookshy.domain.users.service.AuthService;
import com.ssafy.bookshy.domain.users.service.AuthTokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "인증 API", description = "사용자 인증 관련 API")
public class AuthController {

    private final AuthService authService;
    private final AuthTokenService authTokenService;
    private final JwtProvider jwtProvider;

//    @PostMapping("/sign-up")
//    @Operation(
//            summary = "회원가입 메서드",
//            description = "사용자가 회원가입을 하기 위한 메서드입니다.",
//            tags = {"Auth"}
//    )
//    @ApiResponses({
//            @ApiResponse(
//                    responseCode = "200",
//                    description = "회원가입 성공",
//                    content = @Content(schema = @Schema(implementation = JwtTokenDto.class))
//            ),
//            @ApiResponse(responseCode = "400", description = "비밀번호 형식 부적합(영문, 숫자, 특수문자를 포함한 8자리 이상)"),
//            @ApiResponse(responseCode = "400", description = "닉네임 글자 수 부적합(12자리 이하)"),
//            @ApiResponse(responseCode = "409", description = "이미 존재하는 아이디")
//    })
//    public ResponseEntity<JwtTokenDto> signUp(@RequestBody SignUpDto signUpDto) {
//        JwtTokenDto jwtTokenDto = authService.signUp(signUpDto);
//        return ResponseEntity.ok(jwtTokenDto);
//    }

    @PostMapping("/refresh")
    @Operation(
            summary = "토큰 재발급",
            description = "Refresh Token을 이용하여 새로운 Refresh Token, Access Token을 발급 받기 위한 메서드입니다.",
            tags = {"Auth"}
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "토큰 재발급 성공",
                    content = @Content(schema = @Schema(implementation = JwtTokenDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "토큰 재발급 실패",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "유효하지 않은 토큰",
                    content = @Content
            )
    })
    public ResponseEntity<JwtTokenDto> reissueAccessToken(
            @Parameter(description = "Refresh 토큰 (Bearer 포함)", required = true)
            @RequestHeader("Authorization") String refreshToken,

            @Parameter(description = "FCM 토큰 정보", required = true)
            @RequestBody FcmTokenDto deviceTokenDto) {

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
    @Operation(
            summary = "카카오 로그인",
            description = "카카오 OAuth 토큰을 이용해 로그인하기 위한 메서드입니다.",
            tags = {"Auth"}
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "로그인 성공",
                    content = @Content(schema = @Schema(implementation = JwtTokenDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "유효하지 않은 토큰",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "사용자 정보 없음",
                    content = @Content
            )
    })
    public ResponseEntity<JwtTokenDto> kakaoSignIn(
            @Parameter(description = "카카오 OAuth 토큰 정보", required = true)
            @RequestBody OAuthTokenDto oAuthTokenDto) {

        JwtTokenDto jwtTokenDto = authService.signIn(oAuthTokenDto);
        return ResponseEntity.ok(jwtTokenDto);
    }

    @PostMapping("/sign-out")
    @Operation(
            summary = "로그아웃",
            description = "사용자가 로그아웃을 하기 위한 메서드입니다.",
            tags = {"Auth"},
            security = {@SecurityRequirement(name = "Bearer")}
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "로그아웃 성공",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증 실패 또는 존재하지 않는 사용자",
                    content = @Content
            )
    })
    public ResponseEntity<?> signOut(
            @Parameter(description = "JWT 토큰이 포함된 요청", required = true)
            HttpServletRequest request) {

        Long userId = jwtProvider.getUserId(jwtProvider.resolveToken(request).substring(7));
        authService.signOut(userId);
        return ResponseEntity.ok(null);
    }
}