package com.ssafy.bookshy.domain.recommend.service;

import com.ssafy.bookshy.domain.book.dto.BookResponseDto;
import com.ssafy.bookshy.domain.recommend.dto.BookRecommendationResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 사용자 맞춤형 책 추천 서비스
 * - Elasticsearch에서 위시리스트 정보 가져오기
 * - 위시리스트 기반 카테고리 분석
 * - 알라딘 API로 추천 책 제공
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BookRecommendationService {

    private final BookRecommendByCatecory bookRecommendByCatecory;
    private final BookRecommendByAuthor bookRecommendByAuthor;
    private final BookRecommendByBestSeller bookRecommendByBestSeller;
    private final BookRecommendBySimilar bookRecommendBySimilar;
    private final BookRecommendByPopular bookRecommendByPopular;
    private final BookRecommendByRandom bookRecommendByRandom;


    /**
     * 종합 추천 목록을 가져오는 메소드
     * 6가지 추천 타입(카테고리, 작가, 베스트셀러, 유사 유저, 인기, 랜덤)의 책을 모두 조회
     *
     * @param userId
     * @return 종합 추천 정보
     */
    public BookRecommendationResponseDto getAllRecommendations(Long userId) {
        // 각 추천 타입별로 책 목록 조회
        List<BookResponseDto> categoryRecs = bookRecommendByCatecory.getCategoryBasedRecommendations(userId, 3);
        List<BookResponseDto> authorRecs = bookRecommendByAuthor.getAuthorBasedRecommendations(userId, 1);
        List<BookResponseDto> bestsellerRecs = bookRecommendByBestSeller.getBestsellerRecommendations(3);
        List<BookResponseDto> similarUserRecs = bookRecommendBySimilar.getSimilarUserRecommendations(userId, 1);
        List<BookResponseDto> popularRecs = bookRecommendByPopular.getPopularRecommendations(1);
        List<BookResponseDto> randomRecs = bookRecommendByRandom.getRandomRecommendations(userId, 1);

        // 현재 시간 기준으로 다음 갱신 시간 계산 (3시간 후)
        LocalDateTime nextRefresh = LocalDateTime.now().plusHours(3);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String nextRefreshTime = nextRefresh.format(formatter);

        // 종합 응답 DTO 생성
        return BookRecommendationResponseDto.builder()
                .categoryRecommendations(categoryRecs)
                .authorRecommendations(authorRecs)
                .bestsellerRecommendations(bestsellerRecs)
                .similarUserRecommendations(similarUserRecs)
                .popularRecommendations(popularRecs)
                .randomRecommendations(randomRecs)
                .nextRefreshTime(nextRefreshTime)
                .build();
    }
}