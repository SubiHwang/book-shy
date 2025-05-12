package com.ssafy.bookshy.domain.users.controller;

import com.ssafy.bookshy.domain.users.dto.UserProfileResponseDto;
import com.ssafy.bookshy.domain.users.dto.UserProfileUpdateRequestDto;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
@Tag(name = "회원 컨트롤러", description = "로그인, 회원가입, 사용자 인증토큰 발급 등 회원정보를 관리하는 컨트롤러")
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
    public ResponseEntity<UserProfileResponseDto> getProfile(@AuthenticationPrincipal Users user) {
        return ResponseEntity.ok(userService.getUserProfile(user.getUserId()));
    }

    @Operation(
            summary = "🛠️ 마이페이지 프로필 수정 API",
            description = """
                    사용자가 닉네임, 성별, 주소, 위치 정보(위도, 경도)를 수정합니다.  
                    🔐 인증 토큰을 통해 현재 로그인한 사용자 기준으로 수정됩니다.
                    """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "프로필 수정 성공 🎉"),
            @ApiResponse(responseCode = "400", description = "필드 누락 또는 유효하지 않은 값 ⚠️"),
            @ApiResponse(responseCode = "401", description = "인증 실패 또는 토큰 만료 🔐"),
            @ApiResponse(responseCode = "500", description = "서버 오류 또는 DB 저장 실패 ❌")
    })
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal Users user,

            @RequestBody(
                    description = "📝 프로필 수정 요청 정보",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = UserProfileUpdateRequestDto.class),
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "nickname": "강인혁",
                                              "gender": "M",
                                              "address": "서울특별시 강남구 역삼동",
                                              "latitude": 37.5012743,
                                              "longitude": 127.039585
                                            }
                                            """
                            )
                    )
            )
            @org.springframework.web.bind.annotation.RequestBody
            UserProfileUpdateRequestDto requestDto
    ) {
        userService.updateUserProfile(user.getUserId(), requestDto);
        return ResponseEntity.ok().body(
                Map.of(
                        "status", "SUCCESS",
                        "message", "프로필이 성공적으로 수정되었습니다."
                )
        );
    }

    @Operation(
            summary = "🖼️ 프로필 이미지 수정 API",
            description = """
        ✅ 사용자의 프로필 이미지를 수정합니다.  
        🔐 인증된 사용자만 접근 가능하며, 이미지 업로드 후 URL을 반환합니다.
        """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "업로드 성공 🎉"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 파일 누락 ❌"),
            @ApiResponse(responseCode = "401", description = "인증 실패 또는 토큰 만료 🔐"),
            @ApiResponse(responseCode = "500", description = "서버 오류 또는 이미지 저장 실패 ❌")
    })
    @PutMapping(value = "/profile/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> updateProfileImage(
            @AuthenticationPrincipal Users user,
            @RequestPart("image") MultipartFile imageFile
    ) {
        String imageUrl = userService.updateProfileImage(user.getUserId(), imageFile);
        Map<String, Object> response = new HashMap<>();
        response.put("imageUrl", imageUrl);
        response.put("status", "SUCCESS");
        response.put("message", "프로필 이미지가 업로드되었습니다.");
        return ResponseEntity.ok(response);
    }

}
