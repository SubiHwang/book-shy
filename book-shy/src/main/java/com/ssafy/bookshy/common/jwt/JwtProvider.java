package com.ssafy.bookshy.common.jwt;

import com.ssafy.bookshy.common.exception.GlobalException;
import com.ssafy.bookshy.common.exception.JwtErrorCode;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.exception.UserErrorCode;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import com.ssafy.bookshy.domain.users.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;
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
            // Bearer 검증
            if (!token.substring(0, "BEARER ".length()).equalsIgnoreCase("BEARER ")) {
                return false;


            } else {
                token = token.split(" ")[1].trim();
            }
            Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(secretKey.getBytes()).build().parseClaimsJws(token);
            // 만료되었을 시 false
            return !claims.getBody().getExpiration().before(new Date());
        } catch (Exception e) {
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
            throw new GlobalException(UserErrorCode.INVALID_USER_ID);
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
        String username = getNickname(refreshToken);
        Long userId = getUserId(refreshToken);
        Users user = userRepository.findByRefreshToken(refreshToken);
        if (user == null) {
            throw new GlobalException(JwtErrorCode.TOKEN_NOT_FOUND);
        }

        if (!refreshToken.equals(user.getRefreshToken())) {
            throw new GlobalException(JwtErrorCode.REFRESH_NOT_VALID);
        }
        return generateToken(username, userId);
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