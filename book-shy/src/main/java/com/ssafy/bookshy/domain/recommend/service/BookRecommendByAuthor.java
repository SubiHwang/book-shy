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
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookRecommendByAuthor {

    private final RestHighLevelClient elasticsearchClient;
    private final AladinClient aladinClient;
    private final WishRepository wishRepository;
    private final UserRepository usersRepository;

    /**
     * 작가 기반 책 추천
     * Elasticsearch의 집계 기능을 활용하여 사용자가 가장 많이 검색한 작가의 책을 추천
     * 사용자의 위시리스트에 있는 책은 제외하고 추천
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

            // 사용자 정보 조회
            Users user = usersRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userId));

            // 1. Elasticsearch 집계를 사용하여 사용자가 가장 많이 검색한 작가 찾기
            String topAuthor = getMostFrequentAuthorWithAggregation(userId);

            // 가장 많이 검색한 작가를 찾지 못했을 경우
            if (topAuthor == null || topAuthor.isEmpty()) {
                log.info("사용자 {}가 검색한 작가 정보를 찾을 수 없습니다. ", userId);
                // 베스트셀러로 대체
                List<BookResponseDto> bestSellers = aladinClient.getBestSellerRecommendations(recommendCount);
                return convertToBookListResponseDto(bestSellers, user);
            }

            log.info("사용자 {}의 가장 많이 검색한 작가: {}", userId, topAuthor);

            // 2. 해당 작가의 책 목록 가져오기
            // "지음", "저", "글" 등의 불필요한 텍스트 제거
            String cleanAuthorName = topAuthor.replaceAll("\\s*(지음|저|글|옮김|역)\\s*", "").trim();
            log.info("정제된 작가명: {} -> {}", topAuthor, cleanAuthorName);

            // 작가의 모든 책을 가져오기 (충분한 수량으로 설정)
            List<BookListResponseDto> authorBooks = aladinClient.searchListAuthor(cleanAuthorName, 50);

            // 작가의 책을 찾지 못했을 경우
            if (authorBooks == null || authorBooks.isEmpty()) {
                log.info("작가 {}의 책을 찾을 수 없습니다. 베스트셀러로 대체합니다.", topAuthor);
                List<BookResponseDto> bestSellers = aladinClient.getBestSellerRecommendations(recommendCount);
                return convertToBookListResponseDto(bestSellers, user);
            }

            // 3. 사용자의 위시리스트에 있는 알라딘 아이템 ID 목록 가져오기
            Set<Long> wishListAladinItemIds = wishRepository.findAllByUser(user)
                    .stream()
                    .map(wish -> wish.getBook().getItemId())
                    .filter(Objects::nonNull) // null이 아닌 값만 처리
                    .collect(Collectors.toSet());

            // 4. 위시리스트에 없는 책들만 필터링
            List<BookListResponseDto> availableBooks = authorBooks.stream()
                    .filter(book -> {
                        // BookListResponseDto의 itemId는 String 타입이라고 가정
                        if (book.getItemId() == null) {
                            return false;
                        }

                        try {
                            Long bookAladinItemId = book.getItemId();
                            return !wishListAladinItemIds.contains(bookAladinItemId);
                        } catch (NumberFormatException e) {
                            log.warn("ItemId를 Long으로 변환할 수 없습니다: {}", book.getItemId());
                            return false;
                        }
                    })
                    .collect(Collectors.toList());

            // 모든 책이 위시리스트에 있는 경우
            if (availableBooks.isEmpty()) {
                log.info("작가 {}의 모든 책이 이미 위시리스트에 있습니다. 베스트셀러로 대체합니다.", topAuthor);
                List<BookResponseDto> bestSellers = aladinClient.getBestSellerRecommendations(recommendCount);
                return convertToBookListResponseDto(bestSellers, user);
            }

            // 5. 전체 책 목록에서 랜덤으로 하나만 선택
            Random random = new Random();
            int randomIndex = random.nextInt(availableBooks.size());
            BookListResponseDto selectedBook = availableBooks.get(randomIndex);

            // 6. 선택된 책 하나를 리스트로 반환
            List<BookListResponseDto> result = new ArrayList<>();
            result.add(selectedBook);

            log.info("작가 {} 기반 추천 완료: {} (선택된 책: {})",
                    topAuthor, result.size(), selectedBook.getTitle());
            return result;

        } catch (Exception e) {
            log.error("작가 기반 추천 중 오류 발생: {}", e.getMessage(), e);

            // 오류 발생 시 빈 리스트 반환
            return Collections.emptyList();
        }
    }

    /**
     * BookResponseDto 리스트를 BookListResponseDto 리스트로 변환
     * 위시리스트 여부도 확인하여 설정
     */
    private List<BookListResponseDto> convertToBookListResponseDto(List<BookResponseDto> books, Users user) {
        // 사용자의 위시리스트에 있는 알라딘 아이템 ID 목록 가져오기
        Set<Long> wishListAladinItemIds = wishRepository.findAllByUser(user)
                .stream()
                .map(wish -> wish.getBook().getItemId())
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        return books.stream()
                .filter(book -> {
                    // BookResponseDto의 getItemId()는 Long 타입
                    Long bookItemId = book.getItemId();
                    return bookItemId == null || !wishListAladinItemIds.contains(bookItemId);
                })
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