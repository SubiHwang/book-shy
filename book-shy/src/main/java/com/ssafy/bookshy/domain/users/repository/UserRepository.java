package com.ssafy.bookshy.domain.users.repository;

import com.ssafy.bookshy.domain.users.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {

    Optional<Users> findByEmail(String email);

    Users findByRefreshToken(String refreshToken);

    Users findByNickname(String nickname);

    @Query("SELECT u FROM Users u WHERE u.userId <> :userId")
    List<Users> findAllExcept(@Param("userId") Long userId);
}
