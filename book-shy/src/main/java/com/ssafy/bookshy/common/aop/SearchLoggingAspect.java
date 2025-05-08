package com.ssafy.bookshy.common.aop;

import com.ssafy.bookshy.domain.book.dto.BookResponseDto;
import com.ssafy.bookshy.domain.recommend.dto.ClientLogRequestDto;
import com.ssafy.bookshy.domain.recommend.service.LoggingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class SearchLoggingAspect {

    private final LoggingService loggingService;

    //(..)는 모든 파라미터를 의미
    @Pointcut("execution(* com.ssafy.bookshy.domain.book.controller.BookController.searchDetail(..))")
    public void bookSearchDetailListPointcut() {
    }

    /**
     * searchList 메서드가 정상적으로 실행 완료된 후에 실행되는 어드바이스
     *
     * @param joinPoint AOP의 기본 객체로 메서드 정보에 접근 가능
     * @param itemId    메서드에 전달된 검색어 파라미터 (args(q)로 바인딩)
     * @param result    메서드 실행 결과값 (returning="result"로 바인딩)
     */
    @AfterReturning(
            pointcut = "bookSearchDetailListPointcut() && args(itemId)", // itemId로 수정
            returning = "result"
    )
    public void logBookSearch(JoinPoint joinPoint, Long itemId, ResponseEntity<BookResponseDto> result) { // Long 타입으로 수정
        // 현재 인증된 사용자 ID 가져오기
        String userId = getUserId();

        // 검색 결과에서 필요한 정보 추출
        BookResponseDto responseDto = result.getBody();
        log.info("검색 결과 정보 추출 = 작가: {} 제목 : {} 카테고리: {}",
                responseDto != null ? responseDto.getAuthor() : "null",
                responseDto != null ? responseDto.getTitle() : "null",
                responseDto != null ? responseDto.getCategory() : "null");

        Map<String, Object> logData = new HashMap<>();

        if (responseDto != null) {
            logData.put("userId", userId);
            logData.put("title", responseDto.getTitle());
            logData.put("author", responseDto.getAuthor());
            logData.put("category", responseDto.getCategory());
            logData.put("endpoint", "/api/book/search/detail");
        }

        // 3. 로깅 서비스를 통해 ELK로 데이터 전송
        ClientLogRequestDto logDto = new ClientLogRequestDto();
        logDto.setEventType("BOOK_DETAIL_SEARCH");
        logDto.setEventData(logData);

        loggingService.processClientLog(userId, logDto);
    }

    //위시리스트 + 상대 도서 조회

    /**
     * 현재 인증된 사용자의 ID를 가져오는 유틸리티 메서드
     * 인증된 사용자가 없는 경우 "anonymous" 반환
     *
     * @return 사용자 ID 또는 "anonymous"
     */
    private String getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return "anonymous";
    }

}
