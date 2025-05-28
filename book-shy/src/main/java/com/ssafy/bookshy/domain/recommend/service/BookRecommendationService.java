package com.ssafy.bookshy.domain.recommend.service;

import com.ssafy.bookshy.domain.book.dto.BookListResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookListTotalResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookResponseDto;
import com.ssafy.bookshy.external.aladin.AladinClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
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

    // 기본 추천 도서 ID 목록
    private static final List<Long> DEFAULT_BOOK_IDS = Arrays.asList(
            615014L, 245127051L, 40869703L, 25843736L, 347098533L
    );
    private final AladinClient aladinClient;
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

        // 추천 결과가 없는 경우 기본 추천 도서 제공
        if (allRecommendations.isEmpty()) {
            log.info("사용자 {}에 대한 맞춤 추천 결과가 없어 기본 추천 도서를 제공합니다.", userId);
            allRecommendations = getDefaultRecommendations();
        }

        // 종합 응답 DTO 생성
        return BookListTotalResponseDto.builder()
                .total(allRecommendations.size())
                .books(allRecommendations)
                .build();
    }

    /**
     * 기본 추천 도서 목록을 가져오는 메소드
     *
     * @return 기본 추천 도서 목록
     */
    private List<BookListResponseDto> getDefaultRecommendations() {
        List<BookListResponseDto> defaultBooks = new ArrayList<>();

        try {
            // 기본 추천 도서 ID로 도서 정보 조회
            for (Long itemId : DEFAULT_BOOK_IDS) {
                // BookResponseDto를 가져옴
                BookResponseDto bookResponseDto = aladinClient.searchByItemIdToDto(itemId);
                if (bookResponseDto != null && bookResponseDto.getItemId() != null) {
                    // BookResponseDto를 BookListResponseDto로 변환
                    BookListResponseDto bookListDto = convertToBookListResponseDto(bookResponseDto);
                    defaultBooks.add(bookListDto);
                }
            }

            if (defaultBooks.isEmpty()) {
                log.warn("기본 추천 도서 정보를 가져오는 데 실패했습니다.");
            }
        } catch (Exception e) {
            log.error("기본 추천 도서 조회 중 오류 발생: {}", e.getMessage(), e);
        }

        return defaultBooks;
    }

    /**
     * BookResponseDto를 BookListResponseDto로 변환하는 메소드
     *
     * @param bookResponseDto 변환할 BookResponseDto
     * @return 변환된 BookListResponseDto
     */
    private BookListResponseDto convertToBookListResponseDto(BookResponseDto bookResponseDto) {
        return BookListResponseDto.builder()
                .itemId(bookResponseDto.getItemId())
                .title(bookResponseDto.getTitle())
                .author(bookResponseDto.getAuthor())
                .publisher(bookResponseDto.getPublisher())
                .category(bookResponseDto.getCategory()) // categoryName을 category로 매핑
                .coverImageUrl(bookResponseDto.getCoverImageUrl()) // coverUrl을 coverImageUrl로 매핑
                .description(bookResponseDto.getDescription())
                .isLiked(false) // 기본 추천이므로 좋아요 상태는 false로 설정
                .build();
    }
}