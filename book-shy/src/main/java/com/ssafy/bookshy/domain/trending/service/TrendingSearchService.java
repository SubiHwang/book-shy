package com.ssafy.bookshy.domain.trending.service;

import com.ssafy.bookshy.domain.trending.dto.Trend;
import com.ssafy.bookshy.domain.trending.dto.TrendingListResponseDto;
import com.ssafy.bookshy.domain.trending.dto.TrendingResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class TrendingSearchService {

    // Redis 키 상수
    private static final String TRENDING_KEY = "trending:realtime";
    private static final String TRENDING_HOURLY_PREFIX = "trending:hourly:";
    private final RedisTemplate<String, String> redisTemplate;

    /**
     * 검색 로그를 저장하고 실시간 트렌딩 카운트를 증가시킵니다.
     */
    public void sendLog(String query) {
        try {
            if (StringUtils.isEmpty(query)) {
                return;
            }

            // 검색어 정제 (공백 제거, 소문자 변환)
            String keyword = query.trim().toLowerCase();

            // 실시간 트렌딩 카운트 증가
            redisTemplate.opsForZSet().incrementScore(TRENDING_KEY, keyword, 1);

            // 시간별 집계 (트렌드 분석용)
            String hourlyKey = TRENDING_HOURLY_PREFIX +
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHH"));
            redisTemplate.opsForZSet().incrementScore(hourlyKey, keyword, 1);

            log.info("트렌딩 키워드 로깅 완료: {}", keyword);

        } catch (Exception e) {
            log.error("트렌딩 로그 저장 실패", e);
        }
    }

    /**
     * 실시간 인기 검색어 목록을 조회합니다.
     *
     * @return TrendingListResponseDto - 상위 5개 인기 검색어 목록
     */
    public TrendingListResponseDto getTrendingSearchList() {
        try {
            // 상위 5개 키워드 조회
            Set<ZSetOperations.TypedTuple<String>> topKeywords =
                    redisTemplate.opsForZSet()
                            .reverseRangeWithScores(TRENDING_KEY, 0, 4);

            if (topKeywords == null || topKeywords.isEmpty()) {
                return TrendingListResponseDto.builder()
                        .trendingResponseList(Collections.emptyList())
                        .build();
            }

            // TrendingResponse 리스트 생성
            List<TrendingResponse> trendingResponseList = new ArrayList<>();
            int rank = 1;

            for (ZSetOperations.TypedTuple<String> tuple : topKeywords) {
                TrendingResponse response = TrendingResponse.builder()
                        .rank(rank++)
                        .keyword(tuple.getValue())
                        .trend(calculateTrend(tuple.getValue()))
                        .build();

                trendingResponseList.add(response);
            }

            return TrendingListResponseDto.builder()
                    .trendingResponseList(trendingResponseList)
                    .build();

        } catch (Exception e) {
            log.error("트렌딩 검색어 조회 실패", e);
            return TrendingListResponseDto.builder()
                    .trendingResponseList(Collections.emptyList())
                    .build();
        }
    }

    /**
     * 키워드의 트렌드(UP/DOWN/STEADY)를 계산합니다.
     */
    private Trend calculateTrend(String keyword) {
        try {
            // 현재 순위
            Long currentRank = redisTemplate.opsForZSet()
                    .reverseRank(TRENDING_KEY, keyword);

            // 1시간 전 순위
            String prevHourKey = TRENDING_HOURLY_PREFIX +
                    LocalDateTime.now().minusHours(1)
                            .format(DateTimeFormatter.ofPattern("yyyyMMddHH"));

            Long previousRank = redisTemplate.opsForZSet()
                    .reverseRank(prevHourKey, keyword);

            // 트렌드 판단
            if (previousRank == null) {
                return Trend.UP;  // 신규 진입
            }

            if (currentRank < previousRank) {
                return Trend.UP;  // 순위 상승
            } else if (currentRank > previousRank) {
                return Trend.DOWN;  // 순위 하락
            }

            return Trend.STEADY;  // 순위 유지

        } catch (Exception e) {
            log.error("트렌드 계산 실패: {}", keyword, e);
            return Trend.STEADY;
        }
    }
}