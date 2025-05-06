package com.ssafy.bookshy.domain.users.service;

import com.ssafy.bookshy.domain.users.dto.UserProfileResponseDto;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import static com.ssafy.bookshy.common.constants.ImageUrlConstants.PROFILE_IMAGE_BASE_URL;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    public Users getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    public Users getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("인증된 사용자가 없습니다.");
        }
        Long userId = Long.valueOf(auth.getName());
        return getUserById(userId);
    }

    public String getNicknameById(Long userId) {
        return getUserById(userId).getNickname();
    }

    public String getProfileImageUrlById(Long userId) {
        return getUserById(userId).getProfileImageUrl();
    }

    /**
     * 🔍 현재 로그인한 사용자의 프로필 정보를 조회합니다.
     *
     * @param userId 현재 로그인한 사용자 ID
     * @return UserProfileResponseDto 사용자 프로필 정보
     */
    public UserProfileResponseDto getUserProfile(Long userId) {
        Users user = getUserById(userId);

        String fileName = user.getProfileImageUrl(); // 예: "1.png"
        String profileImageUrl = (fileName != null && !fileName.isEmpty())
                ? PROFILE_IMAGE_BASE_URL + fileName
                : null;

        return UserProfileResponseDto.builder()
                .nickname(user.getNickname())
                .bookShyScore((user.getTemperature() != null ? user.getTemperature() : 0))
                .badge(user.getBadges() != null ? user.getBadges() : "북끄북끄 입문자")
                .profileImageUrl(profileImageUrl )
                .build();
    }


    public UserDetails loadUserByNickname(String nickname) throws UsernameNotFoundException {

        Users user = userRepository.findByNickname(nickname);
        if (user == null) {
            throw new UsernameNotFoundException("존재하지 않는 회원입니다.");
        }
        return user;
    }

}
