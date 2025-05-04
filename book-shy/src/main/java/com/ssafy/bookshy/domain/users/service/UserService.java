package com.ssafy.bookshy.domain.users.service;

import com.ssafy.bookshy.common.dto.CommonResponseDto;
import com.ssafy.bookshy.common.dto.ErrorResponse;
import com.ssafy.bookshy.domain.users.dto.UserProfileResponseDto;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.exception.UserErrorCode;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository usersRepository;

    private CommonResponseDto<Users> getUserById(Long userId) {
        if (userId == null) {
            log.warn("[UserService] 유효하지 않은 사용자 ID: null");
            return CommonResponseDto.error(ErrorResponse.of(UserErrorCode.INVALID_USER_ID));
        }

        Users user = usersRepository.findById(userId).orElse(null);

        if (user == null) {
            log.warn("[UserService] 사용자를 찾을 수 없음. ID: {}", userId);
            return CommonResponseDto.error(ErrorResponse.of(UserErrorCode.USER_NOT_FOUND));
        }

        return CommonResponseDto.ok(user);

    }

    public String getNicknameById(Long userId) {
        CommonResponseDto<Users> userResponse = getUserById(userId);

        if (!userResponse.isSuccess()) {
            log.warn("[UserService] 닉네임 조회 실패: {}", userResponse.getError().getMessage());
            return "알 수 없음"; // 또는 적절한 기본값
        }

        return userResponse.getData().getNickname();
    }

    public String getProfileImageUrlById(Long userId) {
        CommonResponseDto<Users> userResponse = getUserById(userId);

        if (!userResponse.isSuccess()) {
            log.warn("[UserService] 프로필 이미지 조회 실패: {}", userResponse.getError().getMessage());
            return null; // 또는 기본 이미지 URL
        }

        return userResponse.getData().getProfileImageUrl();
    }

    /**
     * 🔍 현재 로그인한 사용자의 프로필 정보를 조회합니다.
     *
     * @param userId 현재 로그인한 사용자 ID
     * @return CommonResponseDto<UserProfileResponseDto> 사용자 프로필 정보
     */
    public CommonResponseDto<UserProfileResponseDto> getUserProfile(Long userId) {

        // 사용자 정보 조회
        CommonResponseDto<Users> userResponse = getUserById(userId);

        // 1. 유효성 검증
        if (!userResponse.isSuccess()) {
            return CommonResponseDto.error(userResponse.getError());
        }

        Users user = userResponse.getData();

        // 프로필 이미지 URL 생성
        String fileName = user.getProfileImageUrl();
        String profileImageUrl = (fileName != null && !fileName.isEmpty())
                ? "http://k12d204.p.ssafy.io/images/profile/" + fileName
                : null;

        // 프로필 DTO 생성
        UserProfileResponseDto profileDto = UserProfileResponseDto.builder()
                .nickname(user.getNickname())
                .bookShyScore((user.getTemperature() != null ? user.getTemperature() : 0))
                .badge(user.getBadges() != null ? user.getBadges() : "북끄북끄 입문자")
                .profileImageUrl(profileImageUrl)
                .build();

        return CommonResponseDto.ok(profileDto);

    }

}
