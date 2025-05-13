package com.ssafy.bookshy.domain.recommend.service;

import com.ssafy.bookshy.domain.book.dto.BookListResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookListTotalResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
    private final BookRecommendBySimilar bookRecommendBySimilar;

    /**
     * 종합 추천 목록을 가져오는 메소드
     * 3가지 추천 타입(카테고리, 작가, 유사 유저)의 책을 모두 조회
     *
     * @param userId 사용자 ID
     * @return 종합 추천 정보
     */
    public BookListTotalResponseDto getAllRecommendations(Long userId) {
        // 각 추천 타입별로 책 목록 조회
        List<BookListResponseDto> categoryRecs = bookRecommendByCatecory.getCategoryBasedRecommendations(userId, 4);
        List<BookListResponseDto> authorRecs = bookRecommendByAuthor.getAuthorBasedRecommendations(userId, 2);
        List<BookListResponseDto> similarUserRecs = bookRecommendBySimilar.getSimilarUserRecommendations(userId, 4);

        // 모든 추천 결과를 하나의 리스트로 합침
        List<BookListResponseDto> allRecommendations = new ArrayList<>();
        allRecommendations.addAll(categoryRecs);
        allRecommendations.addAll(authorRecs);
        allRecommendations.addAll(similarUserRecs);

        // 종합 응답 DTO 생성
        return BookListTotalResponseDto.builder()
                .total(allRecommendations.size())
                .books(allRecommendations)
                .build();
    }
}