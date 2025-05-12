package com.ssafy.bookshy.domain.recommend.service;

import com.ssafy.bookshy.domain.book.dto.BookListResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookResponseDto;
import com.ssafy.bookshy.domain.book.repository.WishRepository;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import com.ssafy.bookshy.external.aladin.AladinClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.document.DocumentField;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class BookRecommendByCatecory {

    private final RestHighLevelClient elasticsearchClient;
    private final JdbcTemplate jdbcTemplate;
    private final AladinClient aladinClient;
    private final WishRepository wishRepository;
    private final UserRepository usersRepository;

    /**
     * 사용자 맞춤형 책 추천 메인 메소드
     * 사용자의 위시리스트 분석 후 가장 많이 나타나는 카테고리 기반으로 책 추천
     * 이미 위시리스트에 있는 책은 제외하고 랜덤으로 추천
     *
     * @param userId         추천 대상 사용자 ID
     * @param recommendCount 추천할 책 개수 (기본값 4)
     * @return 추천된 책 목록
     */
    public List<BookListResponseDto> getCategoryBasedRecommendations(Long userId, int recommendCount) {
        // 기본 추천 개수 설정
        if (recommendCount <= 0) {
            recommendCount = 4;
        }

        // 사용자 정보 조회
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userId));

        // STEP 1: Elasticsearch에서 사용자 위시리스트 책 ID 가져오기
        List<Long> bookIds = getUserWishlistedBookIds(userId);

        // 위시리스트가 비어있으면 베스트셀러로 추천
        if (bookIds.isEmpty()) {
            log.info("사용자 {}의 위시리스트가 비어있어 베스트셀러로 추천합니다.", userId);
            List<BookResponseDto> bestSellers = aladinClient.getBestSellerRecommendations(recommendCount);
            return convertToBookListResponseDto(bestSellers, user);
        }

        // STEP 2: 위시리스트 책들의 카테고리 분석
        Map<String, Integer> categoryFrequency = getCategoryFrequency(bookIds);

        // 카테고리 정보를 찾지 못했으면 베스트셀러로 추천
        if (categoryFrequency.isEmpty()) {
            log.info("사용자 {}의 위시리스트 책들의 카테고리를 찾을 수 없어 베스트셀러로 추천합니다.", userId);
            List<BookResponseDto> bestSellers = aladinClient.getBestSellerRecommendations(recommendCount);
            return convertToBookListResponseDto(bestSellers, user);
        }

        // STEP 3: 가장 많이 나타나는 상위 카테고리 선택
        String topCategory = getTopCategory(categoryFrequency);
        log.info("사용자 {}의 최다 선호 카테고리: {}", userId, topCategory);

        // STEP 4: 선택된 카테고리 기반으로 알라딘 API에서 충분한 수의 책 가져오기
        List<BookResponseDto> categoryBooks = aladinClient.getRecommendationsByCategory(topCategory, 20);

        // STEP 5: 위시리스트에 있는 책 제외하고 랜덤 선택
        return selectRandomBooksExcludingWish(categoryBooks, user, recommendCount);
    }

    /**
     * 카테고리 책 목록에서 위시리스트에 없는 책들을 랜덤으로 선택
     */
    private List<BookListResponseDto> selectRandomBooksExcludingWish(List<BookResponseDto> categoryBooks, Users user, int recommendCount) {
        // 사용자의 위시리스트에 있는 책 ID 목록 가져오기 (itemId 사용)
        Set<Long> wishListItemIds = wishRepository.findAllByUser(user)
                .stream()
                .map(wish -> wish.getBook().getItemId())
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // 위시리스트에 없는 책들만 필터링
        List<BookResponseDto> availableBooks = categoryBooks.stream()
                .filter(book -> {
                    Long bookItemId = book.getItemId();
                    return bookItemId == null || !wishListItemIds.contains(bookItemId);
                })
                .collect(Collectors.toList());

        // 만약 필터링 후 책이 부족하면 베스트셀러에서 추가
        if (availableBooks.size() < recommendCount) {
            log.info("카테고리 책이 부족하여 베스트셀러를 추가합니다.");
            List<BookResponseDto> bestSellers = aladinClient.getBestSellerRecommendations(recommendCount * 2);

            // 베스트셀러에서도 위시리스트에 없는 책만 추가
            List<BookResponseDto> filteredBestSellers = bestSellers.stream()
                    .filter(book -> {
                        Long bookItemId = book.getItemId();
                        return bookItemId == null || !wishListItemIds.contains(bookItemId);
                    })
                    .collect(Collectors.toList());

            availableBooks.addAll(filteredBestSellers);

            // 중복 제거
            availableBooks = availableBooks.stream()
                    .distinct()
                    .collect(Collectors.toList());
        }

        // 랜덤하게 섞고 요청한 개수만큼 선택
        Collections.shuffle(availableBooks);
        List<BookResponseDto> selectedBooks = availableBooks.stream()
                .limit(recommendCount)
                .collect(Collectors.toList());

        // BookResponseDto를 BookListResponseDto로 변환
        return convertToBookListResponseDto(selectedBooks, user);
    }

    /**
     * BookResponseDto 리스트를 BookListResponseDto 리스트로 변환
     * 위시리스트 여부도 확인하여 설정
     */
    private List<BookListResponseDto> convertToBookListResponseDto(List<BookResponseDto> books, Users user) {
        // 사용자의 위시리스트에 있는 책 ID 목록 가져오기
        Set<Long> wishListItemIds = wishRepository.findAllByUser(user)
                .stream()
                .map(wish -> wish.getBook().getItemId())
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        return books.stream()
                .map(book -> BookListResponseDto.builder()
                        .itemId(book.getItemId())
                        .title(book.getTitle())
                        .author(book.getAuthor())
                        .publisher(book.getPublisher())
                        .coverImageUrl(book.getCoverImageUrl())
                        .description(book.getDescription())
                        .isLiked(book.getItemId() != null && wishListItemIds.contains(book.getItemId()))
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
                    .size(100) // 최대 100개까지만 조회
                    .fetchSource(true)  // _source 필드 가져오기
                    .fetchField("eventData.bookId");  // 특정 필드 요청

            SearchRequest searchRequest = new SearchRequest("recommend.event")
                    .source(searchSourceBuilder);

            // Elasticsearch 검색 실행
            SearchResponse response = elasticsearchClient.search(searchRequest, RequestOptions.DEFAULT);

            // 검색 결과에서 책 ID 추출
            for (SearchHit hit : response.getHits().getHits()) {
                DocumentField bookIdField = hit.getFields().get("eventData.bookId");

                if (bookIdField != null && bookIdField.getValues() != null) {
                    // fields는 항상 List 형태로 값을 반환
                    for (Object value : bookIdField.getValues()) {
                        if (value != null) {
                            bookIds.add(Long.valueOf(value.toString()));
                        }
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
                // PostgreSQL에서 카테고리 조회 (books 테이블의 PK는 book_id)
                String sql = "SELECT category FROM books WHERE book_id = ?";
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