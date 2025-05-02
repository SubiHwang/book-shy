package com.ssafy.bookshy.domain.users.service;

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


}
