package com.ssafy.bookshy.domain.users.service;

import com.ssafy.bookshy.domain.users.dto.UserProfileResponseDto;
import com.ssafy.bookshy.domain.users.dto.UserProfileUpdateRequestDto;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;
import java.util.UUID;

import static com.ssafy.bookshy.common.constants.ImageUrlConstants.PROFILE_IMAGE_BASE_URL;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    /**
     * 🔍 사용자 ID로 사용자 엔티티를 조회합니다.
     *
     * @param userId 사용자 ID
     * @return Users 사용자 엔티티
     */
    public Users getUserById(Long userId) {
        log.debug("사용자 조회 시작: userId={}", userId);

        Optional<Users> user = userRepository.findById(userId);
        log.debug("조회 결과: {}", user.isPresent() ? "있음" : "없음");

        return user.orElseThrow(() -> {
            log.error("사용자를 찾을 수 없습니다: userId={}", userId);
            return new RuntimeException("사용자를 찾을 수 없습니다. ID: " + userId);
        });
    }

    /**
     * 🛡️ 현재 로그인한 사용자를 Spring Security 컨텍스트에서 추출합니다.
     *
     * @return Users 로그인한 사용자 엔티티
     */
    public Users getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("인증된 사용자가 없습니다.");
        }
        Long userId = Long.valueOf(auth.getName());
        return getUserById(userId);
    }

    /**
     * 🧑‍💼 사용자 ID로 닉네임을 조회합니다.
     *
     * @param userId 사용자 ID
     * @return String 닉네임
     */
    public String getNicknameById(Long userId) {
        return getUserById(userId).getNickname();
    }

    /**
     * 🖼️ 사용자 ID로 프로필 이미지 URL을 조회합니다.
     *
     * @param userId 사용자 ID
     * @return String 이미지 URL
     */
    public String getProfileImageUrlById(Long userId) {
        return getUserById(userId).getProfileImageUrl();
    }

    /**
     * 📄 사용자 프로필 정보를 DTO로 반환합니다.
     *
     * @param userId 사용자 ID
     * @return UserProfileResponseDto 사용자 프로필 응답 DTO
     */
    public UserProfileResponseDto getUserProfile(Long userId) {
        Users user = getUserById(userId);
        return UserProfileResponseDto.from(user);
    }

    /**
     * 🧑‍💻 닉네임 기반으로 사용자 인증 정보를 로드합니다 (Spring Security).
     *
     * @param nickname 사용자 닉네임
     * @return UserDetails Spring Security 사용자 객체
     */
    public UserDetails loadUserByNickname(String nickname) throws UsernameNotFoundException {
        Users user = userRepository.findByNickname(nickname);
        if (user == null) {
            throw new UsernameNotFoundException("존재하지 않는 회원입니다.");
        }
        return user;
    }

    /**
     * 📝 사용자 프로필 정보를 수정합니다.
     * 닉네임, 성별, 주소, 위도, 경도를 수정할 수 있습니다.
     *
     * @param userId 사용자 ID
     * @param dto    수정할 정보가 담긴 DTO
     */
    public void updateUserProfile(Long userId, UserProfileUpdateRequestDto dto) {
        Users user = getUserById(userId);
        user.updateProfile(
                dto.getNickname(),
                dto.getGender(),
                dto.getAddress(),
                dto.getLatitude(),
                dto.getLongitude()
        );
    }

    /**
     * 🖼️ 사용자 프로필 이미지를 수정하고, 이미지 URL을 반환합니다.
     *
     * @param userId    사용자 ID
     * @param imageFile Multipart로 전송된 이미지
     * @return String 저장된 이미지 URL
     */
    @Transactional
    public String updateProfileImage(Long userId, MultipartFile imageFile) {
        if (imageFile == null || imageFile.isEmpty()) {
            throw new IllegalArgumentException("이미지가 업로드되지 않았습니다.");
        }

        Users user = getUserById(userId);

        String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
        String imageUrl = PROFILE_IMAGE_BASE_URL + fileName;

        // 💾 실제 이미지 업로드 수행 (서버 디렉토리 또는 S3)
        uploadImageToServer(imageFile, fileName);

        // 🔄 사용자 엔티티에 새 이미지 URL 반영
        user.updateProfileImageUrl(imageUrl);

        return imageUrl;
    }

    /**
     * 📁 이미지 파일을 서버 로컬 디렉토리에 저장합니다.
     * 저장 경로: /app/images/profile/
     *
     * @param imageFile Multipart 이미지
     * @param fileName  저장할 파일 이름
     */
    private void uploadImageToServer(MultipartFile imageFile, String fileName) {
        try {
            Path uploadPath = Paths.get("/home/ubuntu/bookshy/images/profile"); // 🛣️ 저장 경로
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Files.copy(imageFile.getInputStream(), uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("이미지 업로드 중 오류 발생", e);
        }
    }

    @Transactional
    public void updateLastActiveAt(Long userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));
        user.updateLastActiveAt(LocalDateTime.now(ZoneId.of("Asia/Seoul")));
    }

    /**
     * 📍 사용자 주소 및 위치 정보를 수정합니다.
     * 주로 최초 위치 설정 시 사용됩니다.
     *
     * @param userId    사용자 ID
     * @param address   주소 문자열
     * @param latitude  위도 (null 허용)
     * @param longitude 경도 (null 허용)
     */
    @Transactional
    public void updateUserAddress(Long userId, String address, Double latitude, Double longitude) {
        Users user = getUserById(userId);

        // ⚠️ 닉네임/성별은 유지하고 주소 관련 필드만 수정
        user.updateProfile(
                user.getNickname(),
                user.getGender(),
                address,
                latitude,
                longitude
        );
    }

}
