package com.ssafy.bookshy.kafka.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.bookshy.kafka.dto.MatchSuccessDto;
import com.ssafy.bookshy.kafka.dto.BookCreatedDto;
import com.ssafy.bookshy.kafka.dto.TradeSuccessDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaEventConsumer {

    private final ObjectMapper objectMapper;

    /**
     * 🔔 책 등록 이벤트 수신 (book.created 토픽)
     */
    @KafkaListener(topics = "book.created", groupId = "book-service-group")
    public void listenBookCreated(ConsumerRecord<String, BookCreatedDto> record, Acknowledgment ack) {
        try {
            BookCreatedDto event = record.value();
            log.info("📘 Book Created Event received: {}", event);
            // TODO: 책 등록 처리 로직
            ack.acknowledge();
        } catch (Exception e) {
            log.error("❌ Error processing book.created event: {}", record.value(), e);
        }
    }

    /**
     * 🎉 매칭 성공 이벤트 수신 (match.success 토픽)
     */
    @KafkaListener(topics = "match.success", groupId = "book-service-group")
    public void listenMatchSuccess(ConsumerRecord<String, MatchSuccessDto> record, Acknowledgment ack) {
        try {
            MatchSuccessDto event = record.value();
            log.info("🤝 Match Success Event received: {}", event);
            // TODO: 매칭 성공 처리 로직
            ack.acknowledge();
        } catch (Exception e) {
            log.error("❌ Error processing match.success event: {}", record.value(), e);
        }
    }

    /**
     * 📦 교환 완료 이벤트 수신 (trade.success 토픽)
     */
    @KafkaListener(topics = "trade.success", groupId = "book-service-group")
    public void listenTradeSuccess(ConsumerRecord<String, TradeSuccessDto> record, Acknowledgment ack) {
        try {
            TradeSuccessDto event = record.value();
            log.info("📦 Trade Success Event received: {}", event);
            // TODO: 교환 완료 처리 로직
            ack.acknowledge();
        } catch (Exception e) {
            log.error("❌ Error processing trade.success event: {}", record.value(), e);
        }
    }
}
