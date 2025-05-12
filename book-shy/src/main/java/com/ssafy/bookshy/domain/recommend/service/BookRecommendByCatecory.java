package com.ssafy.bookshy.domain.recommend.service;

import com.ssafy.bookshy.domain.book.dto.BookListResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookResponseDto;
import com.ssafy.bookshy.external.aladin.AladinClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class BookRecommendByCatecory {

    private final RestHighLevelClient elasticsearchClient;
    private final JdbcTemplate jdbcTemplate;
    private final AladinClient aladinClient;

    /**
     * 사용자 맞춤형 책 추천 메인 메소드
     * 사용자의 위시리스트 분석 후 가장 많이 나타나는 카테고리 기반으로 책 추천
     *
     * @param userId         추천 대상 사용자 ID
     * @param recommendCount 추천할 책 개수 (기본값 3)
     * @return 추천된 책 목록
     */
    public List<BookListResponseDto> getCategoryBasedRecommendations(Long userId, int recommendCount) {
        // 기본 추천 개수 설정
        if (recommendCount <= 0) {
            recommendCount = 3;
        }

        // STEP 1: Elasticsearch에서 사용자 위시리스트 책 ID 가져오기
        List<Long> bookIds = getUserWishlistedBookIds(userId);

        // 위시리스트가 비어있으면 베스트셀러로 추천
        if (bookIds.isEmpty()) {
            log.info("사용자 {}의 위시리스트가 비어있어 베스트셀러로 추천합니다.", userId);
            List<BookResponseDto> bestSellers = aladinClient.getBestSellerRecommendations(recommendCount);
            return convertToBookListResponseDto(bestSellers);
        }

        // STEP 2: 위시리스트 책들의 카테고리 분석
        Map<String, Integer> categoryFrequency = getCategoryFrequency(bookIds);

        // 카테고리 정보를 찾지 못했으면 베스트셀러로 추천
        if (categoryFrequency.isEmpty()) {
            log.info("사용자 {}의 위시리스트 책들의 카테고리를 찾을 수 없어 베스트셀러로 추천합니다.", userId);
            List<BookResponseDto> bestSellers = aladinClient.getBestSellerRecommendations(recommendCount);
            return convertToBookListResponseDto(bestSellers);
        }

        // STEP 3: 가장 많이 나타나는 상위 카테고리 선택
        String topCategory = getTopCategory(categoryFrequency);
        log.info("사용자 {}의 최다 선호 카테고리: {}", userId, topCategory);

        // STEP 4: 선택된 카테고리 기반으로 알라딘 API에서 책 추천받기
        List<BookResponseDto> categoryRecommendations = aladinClient.getRecommendationsByCategory(topCategory, recommendCount);
        return convertToBookListResponseDto(categoryRecommendations);
    }

    /**
     * BookResponseDto 리스트를 BookListResponseDto 리스트로 변환
     */
    private List<BookListResponseDto> convertToBookListResponseDto(List<BookResponseDto> books) {
        return books.stream()
                .map(book -> BookListResponseDto.builder()
                        .itemId(book.getAladinItemId())
                        .title(book.getTitle())
                        .author(book.getAuthor())
                        .publisher(book.getPublisher())
                        .coverImageUrl(book.getCoverImageUrl())
                        .description(book.getDescription())
                        .isLiked(false) // 기본값으로 false 설정
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Elasticsearch에서 사용자가 찜한 책 ID 목록을 가져오는 메소드
     *
     * @param userId 위시리스트를 조회할 사용자 ID
     * @return 사용자가 찜한 책 ID 목록
     */
    private List<Long> getUserWishlistedBookIds(Long userId) {
        List<Long> bookIds = new ArrayList<>();

        try {
            // Elasticsearch 쿼리 구성
            BoolQueryBuilder boolQuery = QueryBuilders.boolQuery()
                    .must(QueryBuilders.termQuery("eventType.keyword", "BOOK_WISH_ADD"))
                    .must(QueryBuilders.termQuery("eventData.userId", userId));

            SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
                    .query(boolQuery)
                    .size(100); // 최대 100개까지만 조회

            SearchRequest searchRequest = new SearchRequest("recommend.event")
                    .source(searchSourceBuilder);

            // Elasticsearch 검색 실행
            SearchResponse response = elasticsearchClient.search(searchRequest, RequestOptions.DEFAULT);

            // 검색 결과에서 책 ID 추출
            for (SearchHit hit : response.getHits().getHits()) {
                Map<String, Object> sourceAsMap = hit.getSourceAsMap();

                // eventData.bookId 필드에서 값 추출
                if (sourceAsMap.containsKey("eventData.bookId")) {
                    Object bookIdObj = sourceAsMap.get("eventData.bookId");

                    // 배열 형태인 경우 처리
                    if (bookIdObj instanceof List) {
                        List<?> bookIdList = (List<?>) bookIdObj;
                        if (!bookIdList.isEmpty()) {
                            bookIds.add(Long.valueOf(bookIdList.get(0).toString()));
                        }
                    }
                    // 단일 값인 경우 처리
                    else if (bookIdObj != null) {
                        bookIds.add(Long.valueOf(bookIdObj.toString()));
                    }
                }
            }

            log.info("사용자 {}의 위시리스트에서 {}개의 책 ID를 찾았습니다.", userId, bookIds.size());

        } catch (Exception e) {
            log.error("사용자 {}의 위시리스트 조회 중 오류 발생: {}", userId, e.getMessage());
        }

        return bookIds;
    }

    /**
     * 책 ID 목록으로 각 책의 카테고리를 조회하고 빈도수 계산
     *
     * @param bookIds 카테고리를 조회할 책 ID 목록
     * @return 카테고리별 빈도수 맵
     */
    private Map<String, Integer> getCategoryFrequency(List<Long> bookIds) {
        Map<String, Integer> categoryFrequency = new HashMap<>();

        // 책 ID가 없으면 빈 맵 반환
        if (bookIds.isEmpty()) {
            return categoryFrequency;
        }

        // 각 책의 카테고리 조회
        for (Long bookId : bookIds) {
            try {
                // PostgreSQL에서 카테고리 조회
                String sql = "SELECT category FROM books WHERE id = ?";
                String category = jdbcTemplate.queryForObject(sql, String.class, bookId);

                if (category != null && !category.isEmpty()) {
                    // 메인 카테고리 추출 및 빈도수 증가
                    String mainCategory = extractMainCategory(category);
                    categoryFrequency.put(mainCategory, categoryFrequency.getOrDefault(mainCategory, 0) + 1);
                }
            } catch (Exception e) {
                log.warn("책 ID {}의 DB 카테고리 조회 실패, 알라딘 API로 시도합니다: {}", bookId, e.getMessage());

                // DB에서 조회 실패 시 알라딘 API로 시도
                try {
                    BookResponseDto book = aladinClient.searchByItemIdToDto(bookId);
                    if (book != null && book.getCategory() != null && !book.getCategory().isEmpty()) {
                        String mainCategory = extractMainCategory(book.getCategory());
                        categoryFrequency.put(mainCategory, categoryFrequency.getOrDefault(mainCategory, 0) + 1);
                    }
                } catch (Exception apiEx) {
                    log.error("책 ID {}의 알라딘 API 카테고리 조회도 실패: {}", bookId, apiEx.getMessage());
                }
            }
        }

        log.info("총 {}개의 카테고리가 발견되었습니다: {}", categoryFrequency.size(), categoryFrequency.keySet());
        return categoryFrequency;
    }

    /**
     * 복합 카테고리 문자열에서 메인 카테고리만 추출
     * 예: "소설/시/에세이 > 한국소설" -> "소설"
     *
     * @param categoryPath 카테고리 경로
     * @return 메인 카테고리
     */
    private String extractMainCategory(String categoryPath) {
        if (categoryPath == null || categoryPath.isEmpty()) {
            return "";
        }

        // '>' 구분자 처리
        String[] parts = categoryPath.split(">");
        if (parts.length > 0) {
            // '/' 구분자 처리
            String firstPart = parts[0].trim();
            String[] categories = firstPart.split("/");
            if (categories.length > 0) {
                return categories[0].trim();
            }
        }

        // 구분자가 없는 경우 원본 반환
        return categoryPath.trim();
    }

    /**
     * 카테고리 빈도수 맵에서 가장 많이 등장한 카테고리 반환
     *
     * @param categoryFrequency 카테고리별 빈도수 맵
     * @return 가장 많이 등장한 카테고리
     */
    private String getTopCategory(Map<String, Integer> categoryFrequency) {
        return categoryFrequency.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .findFirst()
                .orElse("소설"); // 기본값 설정
    }
}