package com.ssafy.bookshy.kafka.producer;

import com.ssafy.bookshy.kafka.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

/**
 * 🚀 KafkaProducer
 * - 도메인 이벤트를 Kafka 토픽으로 발행하는 프로듀서 서비스입니다.
 * - 채팅, 책 등록, 매칭 성공, 거래 완료 이벤트를 처리합니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaProducer {

    // ✅ 토픽 이름 상수 정의
    private static final String TOPIC_BOOK_CREATED = "book.created";
    private static final String TOPIC_MATCH_SUCCESS = "match.success";
    private static final String TOPIC_TRADE_SUCCESS = "trade.success";
    private static final String TOPIC_CHAT_MESSAGE = "chat.message";
    private static final String TOPIC_RECOMMEND_EVENT = "recommend.event";
    private final KafkaTemplate<String, Object> kafkaTemplate;

    /**
     * 📘 책 등록 이벤트 발행
     */
    public void sendBookCreatedEvent(BookCreatedDto event) {
        send(TOPIC_BOOK_CREATED, event, "📘 BookCreatedEvent");
    }

    /**
     * 🤝 매칭 성공 이벤트 발행
     */
    public void sendMatchSuccessEvent(MatchSuccessDto event) {
        send(TOPIC_MATCH_SUCCESS, event, "🤝 MatchSuccessEvent");
    }

    /**
     * 📦 교환 완료 이벤트 발행
     */
    public void sendTradeSuccessEvent(TradeSuccessDto event) {
        send(TOPIC_TRADE_SUCCESS, event, "📦 TradeSuccessEvent");
    }

    /**
     * 💬 채팅 메시지 이벤트 발행
     */
    public void sendChatMessage(ChatMessageKafkaDto event) {
        log.info("📤 [KafkaProducer] Sending chat message to topic '{}': {}", TOPIC_CHAT_MESSAGE, event);
        send(TOPIC_CHAT_MESSAGE, event, "💬 ChatMessageEvent");
    }

    /**
     * 💚 로깅 메시지 이벤트 발행
     */
    public void sendRecommendEvent(RecommendMessageKafkaDto event) {
        send(TOPIC_RECOMMEND_EVENT, event, "💬 RecommendEvent");
    }


    /**
     * 🛠 공통 메시지 발행 메서드
     */
    private void send(String topic, Object message, String eventName) {
        try {
            kafkaTemplate.send(topic, message);
            log.info("{} Sent: {}", eventName, message);
        } catch (Exception e) {
            log.error("❌ Failed to send {}", eventName, e);
        }
    }
}
