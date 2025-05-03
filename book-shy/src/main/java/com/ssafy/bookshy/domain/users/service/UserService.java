package com.ssafy.bookshy.domain.users.service;

import com.ssafy.bookshy.domain.users.dto.UserProfileResponseDto;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository usersRepository;

    private Users getUserById(Long userId) {
        return usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    public String getNicknameById(Long userId) {
        return getUserById(userId).getNickname();
    }

    public String getProfileImageUrlById(Long userId) {
        return getUserById(userId).getProfileImageUrl();
    }

    /**
     * 🔍 현재 로그인한 사용자의 프로필 정보를 조회합니다.
     * @param userId 현재 로그인한 사용자 ID
     * @return UserProfileResponseDto 사용자 프로필 정보
     */
    public UserProfileResponseDto getUserProfile(Long userId) {
        Users user = getUserById(userId);

        String fileName = user.getProfileImageUrl(); // 예: "1.png"
        String profileImageUrl = (fileName != null && !fileName.isEmpty())
                ? "http://k12d204.p.ssafy.io/images/profile/" + fileName
                : null; // 기본 이미지가 있다면 이 부분에 기본 URL로 대체 가능

        return UserProfileResponseDto.builder()
                .nickname(user.getNickname())
                .bookShyScore((user.getTemperature() != null ? user.getTemperature() : 0))
                .badge(user.getBadges() != null ? user.getBadges() : "북끄북끄 입문자")
                .profileImageUrl(profileImageUrl)
                .build();
    }
}
