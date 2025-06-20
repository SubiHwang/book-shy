package com.ssafy.bookshy.domain.recommend.service;

import com.ssafy.bookshy.domain.recommend.dto.ClientLogRequestDto;
import com.ssafy.bookshy.domain.trending.service.TrendingSearchService;
import com.ssafy.bookshy.kafka.producer.KafkaProducer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
@Slf4j
public class LoggingService {

    private final KafkaProducer kafkaProducer;
    private final TrendingSearchService trendingSearchService;

    public void processClientLog(ClientLogRequestDto logDto) {
        try {
            // 타임스탬프 처리
            if (logDto.getTimestamp() == null) {
                logDto.setTimestamp(LocalDateTime.now().toString());
            }

            // KafkaProducer 사용해서 이벤트 발행
            kafkaProducer.sendRecommendEvent(logDto.toKafkaDto());

            log.debug("로그 메시지 전송 요청 성공: eventType={}", logDto.getEventType());

        } catch (Exception e) {
            log.error("Failed to process client log: {}", logDto.getEventType(), e);
        }
    }

    public void TredingLog(String q) {
        try {
            trendingSearchService.sendLog(q);

        } catch (Exception e) {
            log.error("로깅 실패 : {}", e);
        }
    }

}