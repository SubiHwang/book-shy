package com.ssafy.bookshy.domain.recommend.service;

import com.ssafy.bookshy.domain.recommend.dto.RecommendMessageKafkaDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;


@Service
@RequiredArgsConstructor
@Slf4j
public class LoggingService {

    private final RestHighLevelClient elasticsearchClient;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void processClientLog(String userId, RecommendMessageKafkaDto logDto) {
        try {
            String eventType = logDto.getEventType();

            // 이벤트 데이터 준비
            Map<String, Object> logData = new HashMap<>();
            logData.put("userId", userId);
            logData.put("eventType", logDto.getEventType());

            // 타임스탬프 처리
            String timestamp = logDto.getTimestamp();
            if (timestamp == null) {
                timestamp = LocalDateTime.now().toString();
            }
            logData.put("timestamp", timestamp);
            logData.put("eventData", logDto.getEventData());

            // 이벤트 타입에 따른 토픽 선택 및 처리
            String topic;
            switch (eventType) {
                case "SEARCH":
                    topic = "bookshy-search-logs";
                    break;
                case "WISHLIST":
                    topic = "bookshy-wishlist-logs";
                    break;
                case "BOOK_VIEW":
                    topic = "bookshy-book-view-logs";
                    break;
                default:
                    topic = "bookshy-general-logs";
            }

            // 카프카로 로그 데이터 전송
            CompletableFuture<SendResult<String, Object>> future =
                    kafkaTemplate.send(topic, userId, logData);

            // 콜백 설정 (카프카가 끝나면 알림 줌)
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    // 성공 처리
                    log.debug("로그 메시지 전송 성공: topic={}, partition={}, offset={}",
                            topic,
                            result.getRecordMetadata().partition(),
                            result.getRecordMetadata().offset());
                } else {
                    // 실패 처리
                    log.error("로그 메시지 전송 실패: topic={}, error={}",
                            topic, ex.getMessage());
                }
            });

        } catch (Exception e) {
            log.error("Failed to process client log: {}", logDto.getEventType(), e);
        }
    }
}