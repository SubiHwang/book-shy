package com.ssafy.bookshy.kafka.producer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.ssafy.bookshy.kafka.dto.MatchSuccessDto;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookProducer {

    private final KafkaTemplate<String, MatchSuccessDto> kafkaTemplate;  // ✅ KafkaTemplate 타입 변경

    public void sendPaymentSuccessEvent(MatchSuccessDto event) {
        try {
            // ✅ JSON 변환 없이 객체 그대로 전송
            kafkaTemplate.send("book.created", event);

            log.info("✅ Sent PaymentSuccessEvent: {}", event);
        } catch (Exception e) {
            log.error("❌ Failed to send PaymentSuccessEvent", e);
        }
    }
}
