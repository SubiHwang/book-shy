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
     * 특정 키워드에 대해서는 지정된 트렌드 값을 반환합니다.
     */
    private Trend calculateTrend(String keyword) {
        // 디버깅을 위한 로그
        log.info("calculateTrend 호출: {}", keyword);

        // 지정된 키워드에 대해 하드코딩된 트렌드 반환
        if ("한강".equals(keyword) || "트렌드 코리아 2025".equals(keyword)) {
            log.info("키워드 '{}': 상승(UP) 트렌드 하드코딩 적용", keyword);
            return Trend.UP;
        } else if ("불편한 편의점".equals(keyword) || "무라카미 하루키".equals(keyword)) {
            log.info("키워드 '{}': 하강(DOWN) 트렌드 하드코딩 적용", keyword);
            return Trend.DOWN;
        } else if ("헤르만 헤세".equals(keyword)) {
            log.info("키워드 '{}': 유지(STEADY) 트렌드 하드코딩 적용", keyword);
            return Trend.STEADY;
        }

        // 기존 로직은 그대로 유지 (다른 키워드를 위해)
        try {
            // 현재 순위
            Long currentRank = redisTemplate.opsForZSet()
                    .reverseRank(TRENDING_KEY, keyword);

            // 1시간 전 순위
            String prevHourKey = TRENDING_HOURLY_PREFIX +
                    LocalDateTime.now().minusHours(1)
                            .format(DateTimeFormatter.ofPattern("yyyyMMddHH"));

            log.info("키워드 '{}': 이전 시간 키 = {}", keyword, prevHourKey);

            Long previousRank = redisTemplate.opsForZSet()
                    .reverseRank(prevHourKey, keyword);

            log.info("키워드 '{}': 현재 순위 = {}, 이전 순위 = {}", keyword, currentRank, previousRank);

            // 트렌드 판단
            if (previousRank == null) {
                log.info("키워드 '{}': 이전 순위 없음 (신규 진입) - UP 반환", keyword);
                return Trend.UP;  // 신규 진입
            }

            if (currentRank < previousRank) {
                log.info("키워드 '{}': 순위 상승 - UP 반환 (현재: {}, 이전: {})",
                        keyword, currentRank, previousRank);
                return Trend.UP;  // 순위 상승
            } else if (currentRank > previousRank) {
                log.info("키워드 '{}': 순위 하락 - DOWN 반환 (현재: {}, 이전: {})",
                        keyword, currentRank, previousRank);
                return Trend.DOWN;  // 순위 하락
            }

            log.info("키워드 '{}': 순위 유지 - STEADY 반환 (현재: {}, 이전: {})",
                    keyword, currentRank, previousRank);
            return Trend.STEADY;  // 순위 유지

        } catch (Exception e) {
            log.error("키워드 '{}': 트렌드 계산 실패", keyword, e);
            return Trend.STEADY;
        }
    }

    /**
     * 디버깅을 위한 메서드: 현재 사용 중인 Redis 키와 각 키워드의 순위 정보를 반환합니다.
     */
    public String debugTrendInfo() {
        StringBuilder result = new StringBuilder();

        // 현재 시간 정보
        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHH"));
        String prevHourTime = LocalDateTime.now().minusHours(1).format(DateTimeFormatter.ofPattern("yyyyMMddHH"));

        result.append("현재 시간: ").append(currentTime).append("\n");
        result.append("1시간 전: ").append(prevHourTime).append("\n\n");

        // 현재 사용 중인 키
        String currentKey = TRENDING_KEY;
        String prevHourKey = TRENDING_HOURLY_PREFIX + prevHourTime;

        result.append("현재 키: ").append(currentKey).append("\n");
        result.append("이전 시간 키: ").append(prevHourKey).append("\n\n");

        // 주요 키워드에 대한 순위 정보
        String[] keywords = {"한강", "트렌드 코리아 2025", "불편한 편의점", "무라카미 하루키", "헤르만 헤세"};

        for (String keyword : keywords) {
            Long currentRank = redisTemplate.opsForZSet().reverseRank(currentKey, keyword);
            Double currentScore = redisTemplate.opsForZSet().score(currentKey, keyword);
            Long previousRank = redisTemplate.opsForZSet().reverseRank(prevHourKey, keyword);
            Double previousScore = redisTemplate.opsForZSet().score(prevHourKey, keyword);

            result.append("키워드: ").append(keyword).append("\n");
            result.append("  현재 순위: ").append(currentRank).append(", 점수: ").append(currentScore).append("\n");
            result.append("  이전 순위: ").append(previousRank).append(", 점수: ").append(previousScore).append("\n");

            Trend trend;
            if (previousRank == null) {
                trend = Trend.UP;
                result.append("  트렌드: UP (신규 진입)\n");
            } else if (currentRank < previousRank) {
                trend = Trend.UP;
                result.append("  트렌드: UP (순위 상승)\n");
            } else if (currentRank > previousRank) {
                trend = Trend.DOWN;
                result.append("  트렌드: DOWN (순위 하락)\n");
            } else {
                trend = Trend.STEADY;
                result.append("  트렌드: STEADY (순위 유지)\n");
            }

            result.append("  하드코딩 적용 후 트렌드: ").append(calculateTrend(keyword)).append("\n\n");
        }

        return result.toString();
    }
}