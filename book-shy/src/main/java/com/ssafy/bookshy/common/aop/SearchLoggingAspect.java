package com.ssafy.bookshy.common.aop;

import com.ssafy.bookshy.domain.book.dto.BookResponseDto;
import com.ssafy.bookshy.domain.recommend.dto.ClientLogRequestDto;
import com.ssafy.bookshy.domain.recommend.service.LoggingService;
import com.ssafy.bookshy.domain.users.entity.Users;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class SearchLoggingAspect {

    private final LoggingService loggingService;

    @Pointcut("execution(* com.ssafy.bookshy.domain.book.controller.BookController.searchDetail(..))")
    public void bookSearchDetailListPointcut() {
    }

    @Pointcut("execution(* com.ssafy.bookshy.domain.book.controller.BookController.searchList(..))")
    public void bookSearchListPointcut() {
    }

    @Pointcut("execution(* com.ssafy.bookshy.domain.book.controller.BookController.addWish(..))")
    public void bookAddWishPointcut() {
    }

    @AfterReturning(
            pointcut = "bookSearchListPointcut() && args(q, user)",
            argNames = "q, user"
    )
    public void logBook(String q, Users user) {
        log.info("🍙 도서 검색 실시간 검색어 로깅 시작");
        loggingService.TredingLog(q);
    }

    /**
     * * searchDetail 메서드가 정상적으로 실행 완료된 후에 실행되는 어드바이스
     * *
     * * @param itemId 도서 ID 파라미터
     * * @param result 메서드 실행 결과값
     */
    @AfterReturning(
            pointcut = "bookSearchDetailListPointcut() && args(itemId, user)",
            argNames = "itemId,user,result",
            returning = "result"
    )
    public void logBookSearch(Long itemId, Users user, ResponseEntity<BookResponseDto> result) {
        // 사용자 ID 가져오기
        Long userId = user.getUserId();

        // 검색 결과에서 필요한 정보 추출
        BookResponseDto responseDto = result.getBody();
        log.info("검색 결과 정보 추출 = 작가: {} 제목 : {} 카테고리: {}",
                responseDto != null ? responseDto.getAuthor() : "null",
                responseDto != null ? responseDto.getTitle() : "null",
                responseDto != null ? responseDto.getCategory() : "null");

        Map<String, Object> logData = new HashMap<>();

        if (responseDto != null) {
            logData.put("userId", userId);
            logData.put("itemId", itemId);
            logData.put("title", responseDto.getTitle());
            logData.put("author", responseDto.getAuthor());
            logData.put("category", responseDto.getCategory());
            logData.put("endpoint", "/api/book/search/detail");
            logData.put("status", result.getStatusCodeValue()); // HTTP 상태 코드 추가
        }

        // 로깅 서비스를 통해 ELK로 데이터 전송
        ClientLogRequestDto logDto = new ClientLogRequestDto();
        logDto.setEventType("BOOK_DETAIL_SEARCH");
        logDto.setEventData(logData);

        log.info("📢 독서 조회 기록을 위한 kafka 호출");

        loggingService.processClientLog(logDto);
    }

    /**
     * addWish 메서드가 정상적으로 실행 완료된 후에 실행되는 어드바이스
     *
     * @param user   인증된 사용자 객체
     * @param itemId 도서 ID 파라미터
     * @param result 메서드 실행 결과값
     */
    @AfterReturning(
            pointcut = "bookAddWishPointcut() && args(itemId, user)",
            argNames = "itemId,user,result",
            returning = "result"
    )
    public void logAddWish(Long itemId, Users user, ResponseEntity<Void> result) {
        // 사용자 ID 추출
        Long userId = user.getUserId();

        log.info("위시리스트 추가 - 사용자: {}, 도서 ID: {}", userId, itemId);

        Map<String, Object> logData = new HashMap<>();
        logData.put("userId", userId);
        logData.put("bookId", itemId);
        logData.put("endpoint", "/api/book/wish");
        logData.put("status", result.getStatusCode().value()); // 최신 버전 호환 방식으로 상태 코드 추가

        // 로깅 서비스를 통해 ELK로 데이터 전송
        ClientLogRequestDto logDto = new ClientLogRequestDto();
        logDto.setEventType("BOOK_WISH_ADD");
        logDto.setEventData(logData);
        log.info("📢 찜하기 기록을 위한 kafka 호출");
        loggingService.processClientLog(logDto);
    }

}