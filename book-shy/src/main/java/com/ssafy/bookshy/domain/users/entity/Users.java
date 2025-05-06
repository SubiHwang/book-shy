package com.ssafy.bookshy.domain.users.entity;

import com.ssafy.bookshy.common.entity.TimeStampEntity;
import com.ssafy.bookshy.domain.library.entity.Library;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "users")
@NoArgsConstructor
@Getter
public class Users extends TimeStampEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

//    @Column(name = "kakao_id", nullable = false)
//    private Long kakaoId;

    @Column(name = "email")
    private String email;

    @Column(name = "nickname", nullable = false, length = 100)
    private String nickname;

    @Column(name = "profile_image_url", columnDefinition = "TEXT")
    private String profileImageUrl;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "age", nullable = false)
    private int age;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Column(name = "temperature")
    private Float temperature;

    @Column(name = "badges", length = 255)
    private String badges = "북끄북끄 입문자"; // ✅ 기본값 설정

    @Builder
    public Users(Long kakaoId, String email, String nickname, String profileImageUrl,
                 String address, int age, Gender gender, Float temperature, String badges) {
//        this.kakaoId = kakaoId;
        this.email = email;
        this.nickname = nickname;
        this.profileImageUrl = profileImageUrl;
        this.address = address;
        this.age = age;
        this.gender = gender;
        this.temperature = temperature;
        this.badges = badges != null ? badges : "북끄북끄 입문자";
    }

    public enum Gender {
        M, F
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Library> libraries;

}
