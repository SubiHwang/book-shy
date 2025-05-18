package com.ssafy.bookshy.common.jwt;

import com.ssafy.bookshy.common.exception.JwtErrorCode;
import com.ssafy.bookshy.common.exception.JwtException;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.exception.UserErrorCode;
import com.ssafy.bookshy.domain.users.exception.UserException;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import com.ssafy.bookshy.domain.users.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;

//JWT properties의 속성들을 기반으로 토큰 생성
@Component
@PropertySource("classpath:application.yml")
@Slf4j
public class JwtProvider {
    private final String secretKey;
    private final long expiration;
    private final String issuer;
    private final UserService userService;
    private final UserRepository userRepository;

    public JwtProvider(@Value("${jwt.secret-key}") String secretKey, @Value("${jwt.expiration-time}") long expiration,
                       @Value("${issuer}") String issuer, UserService userService, UserRepository userRepository) {
        this.secretKey = secretKey;
        this.expiration = expiration;
        this.issuer = issuer;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    /**
     * AccessToken 생성 메소드
     *
     * @param nickname
     * @return JWT 토큰
     */
    public String generateToken(String nickname, Long userId) {

        log.info("💚 토큰 생성 시작");

        return io.jsonwebtoken.Jwts.builder()
                .setSubject(nickname)
                .claim("userId", userId)
                .setIssuer(issuer)
                .setIssuedAt(new java.util.Date(System.currentTimeMillis()))
                .setExpiration(new java.util.Date(System.currentTimeMillis() + expiration))
                .signWith(io.jsonwebtoken.SignatureAlgorithm.HS512, secretKey.getBytes())
                .compact();
    }

    /**
     * JWT 유효성 검사 메소드
     *
     * @param token
     * @return 유효성 여부
     */
    public boolean validateToken(String token) {
        try {
            // 로그 추가: 입력 토큰 확인
            log.info("validateToken - 입력 토큰: {}", token);

            // Bearer 접두사 확인 및 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
                log.info("validateToken - Bearer 제거 후 토큰: {}", token);
            } else {
                log.warn("validateToken - Bearer 접두사 없음");
            }

            Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(secretKey.getBytes()).build().parseClaimsJws(token);

            // 토큰 만료 확인
            boolean isExpired = claims.getBody().getExpiration().before(new Date());
            log.info("validateToken - 토큰 만료 여부: {}", isExpired);

            // 만료되었을 시 false
            return !isExpired;
        } catch (Exception e) {
            // 로그 추가: 예외 상황 확인
            log.error("validateToken - 예외 발생: {}: {}", e.getClass().getName(), e.getMessage());
            return false;
        }
    }

    /**
     * HTTP Header에서 JWT 토큰을 가져오는 메소드
     *
     * @param request
     * @return JWT 토큰
     */
    public String resolveToken(HttpServletRequest request) {
        return request.getHeader("Authorization");
    }

    /**
     * JWT 토큰에서 인증 정보를 가져오는 메소드
     *
     * @param token
     * @return 인증 정보
     */
    public Authentication getAuthentication(String token) {
        UserDetails userDetails = userService.loadUserByNickname(this.getNickname(token));
        if (userDetails == null) {
            throw new UserException(UserErrorCode.INVALID_USER_ID);
        }
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    /**
     * JWT 토큰에서 username을 가져오는 메소드
     *
     * @param token
     * @return username
     */
    public String getNickname(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("토큰 값이 없습니다.");
        }

        // Bearer 접두사 확인 및 제거
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return Jwts.parserBuilder()
                .setSigningKey(secretKey.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * JWT 토큰에서 userId를 가져오는 메소드
     */
    public Long getUserId(String token) {

        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("토큰 값이 없습니다.");
        }

        // Bearer 접두사 확인 및 제거
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        return Jwts.parserBuilder()
                .setSigningKey(secretKey.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("userId", Long.class);
    }

    /**
     * RefreshToken 생성 메소드
     *
     * @param username
     * @return username
     */
    public String generateRefreshToken(String username, Long userId) {
        return io.jsonwebtoken.Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .setIssuer(issuer)
                .setIssuedAt(new java.util.Date(System.currentTimeMillis()))
                .setExpiration(Date.from(Instant.now().plus(15, ChronoUnit.DAYS)))
                .signWith(io.jsonwebtoken.SignatureAlgorithm.HS512, secretKey.getBytes())
                .compact();
    }

    /**
     * RefreshToken으로 AccessToken을 재발급하는 메소드(단 DB에 저장 되어 있던 RefreshToken과 username이 일치해야 함)
     *
     * @param refreshToken
     * @return accessToken
     */
    public String reissueAccessToken(String refreshToken) {
        log.info("재발행을 위해 들어온 이전의 refreshToken: {}", refreshToken);
        String username = getNickname(refreshToken);
        Long userId = getUserId(refreshToken);
        log.info("💚 재발행을 위한 username:{}, userId:{}", username, userId);
        Users user = userRepository.findByRefreshToken(refreshToken);
        if (user == null) {
            throw new JwtException(JwtErrorCode.TOKEN_NOT_FOUND);
        }

        if (!refreshToken.equals(user.getRefreshToken())) {
            throw new JwtException(JwtErrorCode.REFRESH_NOT_VALID);
        }

        String reToken = generateToken(username, userId);
        log.info("💚retoken:{}", reToken);
        return reToken;
    }

    /**
     * 토큰 발급 시간을 가져오는 메소드
     *
     * @param token
     * @return 발급 시간
     */
    public LocalDateTime getIssuedAt(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getIssuedAt()
                .toInstant()
                .atZone(java.time.ZoneId.systemDefault())
                .toLocalDateTime();

    }
}