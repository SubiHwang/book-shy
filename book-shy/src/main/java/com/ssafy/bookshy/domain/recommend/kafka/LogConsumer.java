package com.ssafy.bookshy.domain.recommend.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.xcontent.XContentType;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class LogConsumer {

    private final RestHighLevelClient elasticsearchClient;

    @KafkaListener(
            topics = {"bookshy-search-logs", "bookshy-wishlist-logs", "bookshy-book-view-logs"},
            groupId = "bookshy-log-group"
    )
    public void consume(ConsumerRecord<String, Map<String, Object>> record) {
        try {
            String topic = record.topic();
            Map<String, Object> logData = record.value();

            // 인덱스 이름 결정 (토픽 이름에서 추출)
            String indexName = topic.replace("bookshy-", "").replace("-logs", "");

            log.debug("로그 소비 시작: topic={}, key={}", topic, record.key());

            // 인덱스 요청 생성
            IndexRequest indexRequest = new IndexRequest(indexName)
                    .source(logData, XContentType.JSON);

            try {
                // Elasticsearch에 저장
                IndexResponse response = elasticsearchClient.index(indexRequest, RequestOptions.DEFAULT);
                log.debug("ES에 로그 저장 성공: id={}, index={}", response.getId(), indexName);
            } catch (IOException e) {
                // 응답 파싱 오류인 경우 저장 성공으로 간주
                if (e.getMessage().contains("Unable to parse response body") &&
                        e.getMessage().contains("201 Created")) {
                    log.debug("ES에 로그 저장 추정 성공 (응답 파싱 오류 무시): index={}", indexName);
                } else {
                    log.error("ES에 로그 저장 실패: index={}, error={}", indexName, e.getMessage());
                    // 심각한 오류가 아니라면 재시도하지 않음 (카프카가 자동으로 재시도)
                }
            }
        } catch (Exception e) {
            log.error("로그 처리 중 예상치 못한 오류: {}", e.getMessage());
        }
    }


}
