package com.ssafy.bookshy.domain.recommend.service;

import com.ssafy.bookshy.domain.recommend.dto.ClientLogRequestDto;
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

    public void processClientLog(String userId, ClientLogRequestDto logDto) {
        try {
            // 타임스탬프 처리
            if (logDto.getTimestamp() == null) {
                logDto.setTimestamp(LocalDateTime.now().toString());
            }

            // 사용자 ID 추가 (필요하다면)
            if (logDto.getEventData() != null) {
                logDto.getEventData().put("userId", userId);
            }

            // KafkaProducer 사용해서 이벤트 발행
            kafkaProducer.sendRecommendEvent(logDto.toKafkaDto());

            log.debug("로그 메시지 전송 요청 성공: userId={}, eventType={}",
                    userId, logDto.getEventType());

        } catch (Exception e) {
            log.error("Failed to process client log: {}", logDto.getEventType(), e);
        }
    }
}