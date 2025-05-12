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
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookRecommendByAuthor {

    private final RestHighLevelClient elasticsearchClient;
    private final AladinClient aladinClient;

    /**
     * 작가 기반 책 추천
     * Elasticsearch의 집계 기능을 활용하여 사용자가 가장 많이 검색한 작가의 책을 추천
     *
     * @param userId         사용자 ID
     * @param recommendCount 추천 받을 책 개수 (기본값 1)
     * @return 작가 기반 추천 책 목록
     */
    public List<BookListResponseDto> getAuthorBasedRecommendations(Long userId, int recommendCount) {
        try {
            log.info("사용자 {} 작가 기반 추천 시작", userId);

            // 기본 추천 개수 설정
            if (recommendCount <= 0) {
                recommendCount = 1;
            }

            // 1. Elasticsearch 집계를 사용하여 사용자가 가장 많이 검색한 작가 찾기
            String topAuthor = getMostFrequentAuthorWithAggregation(userId);

            // 가장 많이 검색한 작가를 찾지 못했을 경우
            if (topAuthor == null || topAuthor.isEmpty()) {
                log.info("사용자 {}가 검색한 작가 정보를 찾을 수 없습니다. 베스트셀러로 대체합니다.", userId);
                List<BookResponseDto> bestSellers = aladinClient.getBestSellerRecommendations(recommendCount);
                return convertToBookListResponseDto(bestSellers);
            }

            log.info("사용자 {}의 가장 많이 검색한 작가: {}", userId, topAuthor);

            // 2. 해당 작가의 책 목록 가져오기
            List<BookResponseDto> authorBooks = aladinClient.searchByKeyword(topAuthor);

            // 작가의 책을 찾지 못했을 경우
            if (authorBooks.isEmpty()) {
                log.info("작가 {}의 책을 찾을 수 없습니다. 베스트셀러로 대체합니다.", topAuthor);
                List<BookResponseDto> bestSellers = aladinClient.getBestSellerRecommendations(recommendCount);
                return convertToBookListResponseDto(bestSellers);
            }

            // 4. 랜덤하게 섞어서 선택
            Collections.shuffle(authorBooks);

            // 5. 요청 개수만큼 반환 (목록이 부족하면 있는 만큼만 반환)
            List<BookResponseDto> result = authorBooks.stream()
                    .limit(recommendCount)
                    .collect(Collectors.toList());

            log.info("작가 {} 기반 추천 완료: {}권", topAuthor, result.size());
            return convertToBookListResponseDto(result);

        } catch (Exception e) {
            log.error("작가 기반 추천 중 오류 발생: {}", e.getMessage(), e);

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
     * Elasticsearch 집계 기능을 사용하여 가장 많이 검색한 작가 찾기
     * terms aggregation을 활용하여 효율적으로 작가별 검색 빈도 계산
     */
    private String getMostFrequentAuthorWithAggregation(Long userId) throws IOException {
        // 1. 검색 요청 구성
        SearchRequest searchRequest = new SearchRequest("recommend.event");

        // 2. 쿼리 빌더 생성 - 검색 필터 설정
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery()
                .must(QueryBuilders.termQuery("eventType.keyword", "BOOK_DETAIL_SEARCH"))
                .must(QueryBuilders.termQuery("eventData.userId", userId));

        // 3. 집계 설정 - 작가별 카운트 집계
        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder()
                .query(boolQuery)
                .size(0) // 검색 결과는 필요 없고 집계 결과만 필요
                .aggregation(AggregationBuilders.terms("author_counts")
                        .field("eventData.author.keyword")
                        .size(10)); // 상위 10명의 작가만 집계

        searchRequest.source(sourceBuilder);

        // 4. 검색 실행
        SearchResponse response = elasticsearchClient.search(searchRequest, RequestOptions.DEFAULT);

        // 5. 집계 결과 처리
        Terms authorTerms = response.getAggregations().get("author_counts");

        // 집계 결과가 있는지 확인
        if (authorTerms.getBuckets().isEmpty()) {
            return null;
        }

        // 6. 가장 많이 검색된 작가 반환 (동점이면 첫 번째 선택)
        return authorTerms.getBuckets().get(0).getKeyAsString();
    }
}