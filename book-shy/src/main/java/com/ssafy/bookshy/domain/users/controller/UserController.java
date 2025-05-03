package com.ssafy.bookshy.domain.users.controller;

import com.ssafy.bookshy.domain.users.dto.UserProfileResponseDto;
import com.ssafy.bookshy.domain.users.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage")
public class UserController {

    private final UserService userService;

    @Operation(
            summary = "👤 마이페이지 프로필 조회 API",
            description = """
            ✅ 마이페이지 상단에 출력될 사용자 정보를 조회합니다.  
            🔐 인증 토큰 기반으로 현재 로그인된 사용자의 정보를 반환합니다.
            """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "프로필 정보 조회 성공 🎉"),
            @ApiResponse(responseCode = "401", description = "인증 실패 또는 토큰 만료 🔐"),
            @ApiResponse(responseCode = "500", description = "서버 오류 또는 데이터 조회 실패 ❌")
    })
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponseDto> getProfile(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }
}
