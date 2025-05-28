package com.ssafy.bookshy.common.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.bookshy.common.jwt.JwtProvider;
import com.ssafy.bookshy.common.response.CommonResponse;
import com.ssafy.bookshy.common.response.ErrorResponse;
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
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // 인증이 필요없는 URL 패턴 목록
    private static final List<String> EXCLUDED_URLS = Arrays.asList(
            "/api/auth/sign-in/kakao",
            "/api/auth/refresh",
            "/api/auth/oauth/callback",
            "/api/health",
            "/swagger-ui",
            "/v3/api-docs",
            "/ws-chat"
    );
    private final JwtProvider jwtProvider;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        log.info("JwtAuthenticationFilter - 요청 URI: {}", requestURI);

        // 인증이 필요없는 URL은 토큰 검증 생략
        if (isExcludedUrl(requestURI)) {
            log.info("인증이 필요없는, 제외된 경로: {}", requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = jwtProvider.resolveToken(request);
            log.info("resolveToken 결과: {}", token != null ? "토큰 있음" : "토큰 없음");

            if (token != null) {
                log.info("토큰 검증 시작");

                if (jwtProvider.validateToken(token)) {
                    log.info("토큰 유효함");
                    Authentication auth = jwtProvider.getAuthentication(token);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    log.info("인증 객체 설정 완료");
                } else {
                    log.warn("유효하지 않은 토큰");
                    handleAuthenticationFailure(response, HttpServletResponse.SC_UNAUTHORIZED, "토큰이 만료되었거나 유효하지 않습니다");
                    return;
                }
            } else {
                log.warn("토큰이 없음");
                handleAuthenticationFailure(response, HttpServletResponse.SC_UNAUTHORIZED, "인증 토큰이 필요합니다");
                return;
            }

            filterChain.doFilter(request, response);
            log.info("필터 체인 완료");

        } catch (UsernameNotFoundException e) {
            log.error("인증 실패: 사용자를 찾을 수 없음 - {}", e.getMessage());
            handleAuthenticationFailure(response, HttpServletResponse.SC_UNAUTHORIZED, "이미 탈퇴한 회원입니다");
        } catch (Exception e) {
            log.error("인증 과정에서 예외 발생: {}: {}", e.getClass().getName(), e.getMessage());
            handleAuthenticationFailure(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "인증 처리 중 오류가 발생했습니다");
        }
    }

    /**
     * 인증 실패 시 JSON 형식의 응답 반환
     */
    private void handleAuthenticationFailure(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");

        ErrorResponse errorResponse = ErrorResponse.of(message, status);
        CommonResponse<Void> apiResponse = CommonResponse.fail(errorResponse);

        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
    }

    /**
     * 요청 URL이 인증 제외 대상인지 확인
     */
    private boolean isExcludedUrl(String requestURI) {
        return EXCLUDED_URLS.stream().anyMatch(requestURI::startsWith);
    }
}