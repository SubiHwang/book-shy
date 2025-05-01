package com.ssafy.bookshy.kafka.producer;

import com.ssafy.bookshy.kafka.dto.BookCreatedDto;
import com.ssafy.bookshy.kafka.dto.MatchSuccessDto;
import com.ssafy.bookshy.kafka.dto.TradeSuccessDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate; // ✅ 제네릭 KafkaTemplate 사용

    public void sendBookCreatedEvent(BookCreatedDto event) {
        try {
            kafkaTemplate.send("book.created", event);
            log.info("📘 Sent BookCreatedEvent: {}", event);
        } catch (Exception e) {
            log.error("❌ Failed to send BookCreatedEvent", e);
        }
    }

    public void sendMatchSuccessEvent(MatchSuccessDto event) {
        try {
            kafkaTemplate.send("match.success", event);
            log.info("🤝 Sent MatchSuccessEvent: {}", event);
        } catch (Exception e) {
            log.error("❌ Failed to send MatchSuccessEvent", e);
        }
    }

    public void sendTradeSuccessEvent(TradeSuccessDto event) {
        try {
            kafkaTemplate.send("trade.success", event);
            log.info("📦 Sent TradeSuccessEvent: {}", event);
        } catch (Exception e) {
            log.error("❌ Failed to send TradeSuccessEvent", e);
        }
    }
}
