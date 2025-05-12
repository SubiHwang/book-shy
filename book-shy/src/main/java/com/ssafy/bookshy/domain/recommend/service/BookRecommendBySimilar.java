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
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookRecommendBySimilar {

    private final RestHighLevelClient elasticsearchClient;
    private final AladinClient aladinClient;

    /**
     * 유사 사용자 기반 책 추천
     * 내 서재와 겹치는 책이 많은 사용자의 책 중 하나를 추천
     *
     * @param userId         사용자 ID
     * @param recommendCount 추천 받을 책 개수
     * @return 유사 사용자 기반 추천 책 목록
     */
    public List<BookListResponseDto> getSimilarUserRecommendations(Long userId, int recommendCount) {
        try {
            log.info("사용자 {} 유사 사용자 기반 추천 시작", userId);

            // 기본 추천 개수 설정
            if (recommendCount <= 0) {
                recommendCount = 1;
            }

            // 1. 내 위시리스트(서재) 가져오기
            List<Long> myBookIds = getWishlistedBookIds(userId);

            // 내 위시리스트가 비어있으면 베스트셀러로 대체
            if (myBookIds.isEmpty()) {
                log.info("사용자 {}의 위시리스트가 비어있습니다. 베스트셀러로 대체합니다.", userId);
                List<BookResponseDto> bestSellers = aladinClient.getBestSellerRecommendations(recommendCount);
                return convertToBookListResponseDto(bestSellers);
            }

            log.info("사용자 {}의 위시리스트 책 수: {}", userId, myBookIds.size());

            // 2. 다른 사용자들의 위시리스트 가져오기
            Map<Long, List<Long>> otherUsersBooks = getOtherUsersWishlists(userId);

            // 다른 사용자 정보가 없으면 베스트셀러로 대체
            if (otherUsersBooks.isEmpty()) {
                log.info("다른 사용자 정보를 찾을 수 없습니다. 베스트셀러로 대체합니다.");
                List<BookResponseDto> bestSellers = aladinClient.getBestSellerRecommendations(recommendCount);
                return convertToBookListResponseDto(bestSellers);
            }

            // 3. 유사도 계산 (겹치는 책 수 기준)
            Map<Long, Integer> userSimilarity = calculateSimilarity(myBookIds, otherUsersBooks);

            // 유사한 사용자가 없으면 베스트셀러로 대체
            if (userSimilarity.isEmpty()) {
                log.info("유사한 사용자를 찾을 수 없습니다. 베스트셀러로 대체합니다.");
                List<BookResponseDto> bestSellers = aladinClient.getBestSellerRecommendations(recommendCount);
                return convertToBookListResponseDto(bestSellers);
            }

            // 4. 가장 유사한 사용자 찾기
            Long mostSimilarUserId = findMostSimilarUser(userSimilarity);
            log.info("사용자 {}와 가장 유사한 사용자: {}", userId, mostSimilarUserId);

            // 5. 유사 사용자의 책 중 내가 가지고 있지 않은 책 찾기
            List<Long> similarUserBooks = otherUsersBooks.get(mostSimilarUserId);
            List<Long> recommendableBookIds = similarUserBooks.stream()
                    .filter(bookId -> !myBookIds.contains(bookId))
                    .collect(Collectors.toList());

            // 추천할 책이 없으면 베스트셀러로 대체
            if (recommendableBookIds.isEmpty()) {
                log.info("유사 사용자와 겹치지 않는 책이 없습니다. 베스트셀러로 대체합니다.");
                List<BookResponseDto> bestSellers = aladinClient.getBestSellerRecommendations(recommendCount);
                return convertToBookListResponseDto(bestSellers);
            }

            // 6. 랜덤하게 섞어서 선택
            Collections.shuffle(recommendableBookIds);

            // 7. 요청 개수만큼 선택하고 책 정보 가져오기
            List<BookResponseDto> result = new ArrayList<>();
            for (int i = 0; i < Math.min(recommendCount, recommendableBookIds.size()); i++) {
                try {
                    BookResponseDto book = aladinClient.searchByItemIdToDto(recommendableBookIds.get(i));
                    if (book != null && book.getTitle() != null) {
                        result.add(book);
                    }
                } catch (Exception e) {
                    log.warn("책 정보 조회 실패: {}", e.getMessage());
                }
            }

            // 결과가 없으면 베스트셀러로 대체
            if (result.isEmpty()) {
                log.info("추천 결과가 없습니다. 베스트셀러로 대체합니다.");
                List<BookResponseDto> bestSellers = aladinClient.getBestSellerRecommendations(recommendCount);
                return convertToBookListResponseDto(bestSellers);
            }

            log.info("유사 사용자 기반 추천 완료: {}권", result.size());
            return convertToBookListResponseDto(result);

        } catch (Exception e) {
            log.error("유사 사용자 기반 추천 중 오류 발생: {}", e.getMessage(), e);

            // 오류 발생 시 빈 리스트 반환
            return Collections.emptyList();
        }
    }

    /**
     * BookResponseDto 리스트를 BookListResponseDto 리스트로 변환
     */
    private List<BookListResponseDto> convertToBookListResponseDto(List<BookResponseDto> books) {
        return books.stream()
                .map(book -> BookListResponseDto.builder()
                        .itemId(book.getItemId())
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
     * 사용자의 위시리스트(서재) 책 ID 목록 가져오기
     */
    private List<Long> getWishlistedBookIds(Long userId) throws IOException {
        List<Long> bookIds = new ArrayList<>();

        // Elasticsearch 쿼리 구성
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery()
                .must(QueryBuilders.termQuery("eventType.keyword", "BOOK_WISH_ADD"))
                .must(QueryBuilders.termQuery("eventData.userId", userId));

        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder()
                .query(boolQuery)
                .size(100);

        SearchRequest searchRequest = new SearchRequest("recommend.event")
                .source(sourceBuilder);

        // 검색 실행
        SearchResponse response = elasticsearchClient.search(searchRequest, RequestOptions.DEFAULT);

        // 결과 처리
        for (SearchHit hit : response.getHits().getHits()) {
            Map<String, Object> sourceAsMap = hit.getSourceAsMap();

            if (sourceAsMap.containsKey("eventData.bookId")) {
                Object bookIdObj = sourceAsMap.get("eventData.bookId");

                if (bookIdObj instanceof List) {
                    List<?> bookIdList = (List<?>) bookIdObj;
                    if (!bookIdList.isEmpty()) {
                        bookIds.add(Long.valueOf(bookIdList.get(0).toString()));
                    }
                } else if (bookIdObj != null) {
                    bookIds.add(Long.valueOf(bookIdObj.toString()));
                }
            }
        }

        return bookIds;
    }

    /**
     * 다른 사용자들의 위시리스트 가져오기
     */
    private Map<Long, List<Long>> getOtherUsersWishlists(Long userId) throws IOException {
        Map<Long, List<Long>> userBooks = new HashMap<>();

        // Elasticsearch 쿼리 구성
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery()
                .must(QueryBuilders.termQuery("eventType.keyword", "BOOK_WISH_ADD"))
                .mustNot(QueryBuilders.termQuery("eventData.userId", userId));

        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder()
                .query(boolQuery)
                .size(1000);

        SearchRequest searchRequest = new SearchRequest("recommend.event")
                .source(sourceBuilder);

        // 검색 실행
        SearchResponse response = elasticsearchClient.search(searchRequest, RequestOptions.DEFAULT);

        // 결과 처리
        for (SearchHit hit : response.getHits().getHits()) {
            Map<String, Object> sourceAsMap = hit.getSourceAsMap();

            if (sourceAsMap.containsKey("eventData.userId") && sourceAsMap.containsKey("eventData.bookId")) {
                Long otherUserId = Long.valueOf(sourceAsMap.get("eventData.userId").toString());

                Object bookIdObj = sourceAsMap.get("eventData.bookId");
                Long bookId = null;

                if (bookIdObj instanceof List) {
                    List<?> bookIdList = (List<?>) bookIdObj;
                    if (!bookIdList.isEmpty()) {
                        bookId = Long.valueOf(bookIdList.get(0).toString());
                    }
                } else if (bookIdObj != null) {
                    bookId = Long.valueOf(bookIdObj.toString());
                }

                if (bookId != null) {
                    userBooks.computeIfAbsent(otherUserId, k -> new ArrayList<>()).add(bookId);
                }
            }
        }

        return userBooks;
    }

    /**
     * 사용자 간 유사도 계산 (겹치는 책 수 기준)
     */
    private Map<Long, Integer> calculateSimilarity(List<Long> myBooks, Map<Long, List<Long>> otherUsersBooks) {
        Map<Long, Integer> similarity = new HashMap<>();

        for (Map.Entry<Long, List<Long>> entry : otherUsersBooks.entrySet()) {
            Long otherUserId = entry.getKey();
            List<Long> otherBooks = entry.getValue();

            // 겹치는 책 수 계산
            int overlap = 0;
            for (Long myBookId : myBooks) {
                if (otherBooks.contains(myBookId)) {
                    overlap++;
                }
            }

            // 1개 이상 겹치는 경우만 유사 사용자로 간주
            if (overlap > 0) {
                similarity.put(otherUserId, overlap);
            }
        }

        return similarity;
    }

    /**
     * 가장 유사한 사용자 찾기 (겹치는 책이 가장 많은 사용자)
     */
    private Long findMostSimilarUser(Map<Long, Integer> userSimilarity) {
        return userSimilarity.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
    }
}