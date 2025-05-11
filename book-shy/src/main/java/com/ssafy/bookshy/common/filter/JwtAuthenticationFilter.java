package com.ssafy.bookshy.common.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.bookshy.common.jwt.JwtProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j // Lombok을 사용하는 경우 추가
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Lombok을 사용하지 않는 경우 다음 코드 추가
    // private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("JwtAuthenticationFilter - 요청 URI: {}", request.getRequestURI());

        // API 엔드포인트 로깅
        if (request.getRequestURI().equals("/api/auth/refresh")) {
            log.info("토큰 재발급 엔드포인트 요청 감지");
        }

        // 헤더 정보 로깅
        log.info("Authorization 헤더: {}", request.getHeader("Authorization"));

        String token = jwtProvider.resolveToken(request);
        log.info("resolveToken 결과: {}", token);

        if (token != null) {
            log.info("토큰 검증 시작");
            boolean isValid = jwtProvider.validateToken(token);
            log.info("토큰 검증 결과: {}", isValid);

            if (isValid) {
                try {
                    log.info("인증 객체 생성 시작");
                    Authentication auth = jwtProvider.getAuthentication(token);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    log.info("인증 객체 생성 및 설정 완료");
                } catch (UsernameNotFoundException e) {
                    log.error("인증 실패: 사용자를 찾을 수 없음 - {}", e.getMessage());
                    e.printStackTrace();
                    response.setStatus(401);
                    response.setCharacterEncoding("utf-8");
                    response.setContentType("application/json");
                    response.getWriter().write(objectMapper.writeValueAsString("이미 탈퇴한 회원입니다."));
                    return;
                } catch (Exception e) {
                    log.error("인증 과정에서 예외 발생: {}: {}", e.getClass().getName(), e.getMessage());
                }
            } else {

                log.warn("유효하지 않은 토큰");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setCharacterEncoding("utf-8");
                response.setContentType("application/json");
                response.getWriter().write(objectMapper.writeValueAsString("Access Token이 만료되었거나 유효하지 않습니다."));
                return;
            }
        } else {
            log.info("토큰이 없음");
        }

        log.info("필터 체인 계속 진행");
        filterChain.doFilter(request, response);
        log.info("필터 체인 완료");
    }
}
