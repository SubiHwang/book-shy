package com.ssafy.bookshy.kafka.producer;

import com.ssafy.bookshy.kafka.dto.BookCreatedDto;
import com.ssafy.bookshy.kafka.dto.ChatMessageKafkaDto;
import com.ssafy.bookshy.kafka.dto.MatchSuccessDto;
import com.ssafy.bookshy.kafka.dto.TradeSuccessDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

/**
 * 🚀 KafkaProducer
 * - 각종 도메인 이벤트를 Kafka 토픽으로 발행하는 클래스입니다.
 * - 채팅, 책 등록, 매칭 성공, 거래 완료 등의 이벤트를 처리합니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaProducer {

    // 🧵 KafkaTemplate (제네릭 형태로 다양한 DTO 전송 가능)
    private final KafkaTemplate<String, Object> kafkaTemplate;

    /**
     * 📘 책 등록 이벤트 발행
     * - 토픽: book.created
     * - 새로 책이 등록되었을 때 호출됩니다.
     */
    public void sendBookCreatedEvent(BookCreatedDto event) {
        try {
            kafkaTemplate.send("book.created", event);
            log.info("📘 Sent BookCreatedEvent: {}", event);
        } catch (Exception e) {
            log.error("❌ Failed to send BookCreatedEvent", e);
        }
    }

    /**
     * 🤝 매칭 성공 이벤트 발행
     * - 토픽: match.success
     * - 책 교환 매칭이 성사되었을 때 호출됩니다.
     */
    public void sendMatchSuccessEvent(MatchSuccessDto event) {
        try {
            kafkaTemplate.send("match.success", event);
            log.info("🤝 Sent MatchSuccessEvent: {}", event);
        } catch (Exception e) {
            log.error("❌ Failed to send MatchSuccessEvent", e);
        }
    }

    /**
     * 📦 교환 완료 이벤트 발행
     * - 토픽: trade.success
     * - 책 교환이 실제로 완료되었을 때 호출됩니다.
     */
    public void sendTradeSuccessEvent(TradeSuccessDto event) {
        try {
            kafkaTemplate.send("trade.success", event);
            log.info("📦 Sent TradeSuccessEvent: {}", event);
        } catch (Exception e) {
            log.error("❌ Failed to send TradeSuccessEvent", e);
        }
    }

    /**
     * 💬 채팅 메시지 이벤트 발행
     * - 토픽: chat.message
     * - 클라이언트가 WebSocket을 통해 보낸 채팅 메시지를 Kafka로 전달합니다.
     */
    public void sendChatMessage(ChatMessageKafkaDto event) {
        try {
            kafkaTemplate.send("chat.message", event);
            log.info("💬 Sent ChatMessageEvent: {}", event);
        } catch (Exception e) {
            log.error("❌ Failed to send ChatMessageEvent", e);
        }
    }
}
