package com.ssafy.bookshy.domain.users.entity;

import com.ssafy.bookshy.common.entity.TimeStampEntity;
import com.ssafy.bookshy.domain.library.entity.Library;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class Users extends TimeStampEntity implements UserDetails {

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

    @Column(name = "address")
    private String address;

    @Column(name = "age")
    private int age;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "temperature")
    private Float temperature;

    @Column(name = "badges")
    private String badges = "북끄북끄 입문자";

    @Column(name = "refresh_token")
    private String refreshToken;

    @Column(name = "fcm_token")
    private String fcmToken;

    public void updateTokens(String refreshToken, String fcmToken) {
        this.refreshToken = refreshToken;
        this.fcmToken = fcmToken;
    }

    @Builder
    public Users(String email, String nickname, String profileImageUrl,
                 String address, int age, Gender gender, Float temperature,
                 String badges, String refreshToken, String fcmToken) {
        this.email = email;
        this.nickname = nickname;
        this.profileImageUrl = profileImageUrl;
        this.address = address;
        this.age = age;
        this.gender = gender;
        this.temperature = temperature;
        this.badges = badges != null ? badges : "북끄북끄 입문자";
        this.refreshToken = refreshToken;
        this.fcmToken = fcmToken;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return "";
    }

    @Override
    public String getUsername() {
        return this.getNickname();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public enum Gender {
        M, F
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Library> libraries;
}
