package com.ssafy.bookshy.kafka.producer;

import com.ssafy.bookshy.kafka.config.KafkaTopicResolver;
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

    private final KafkaTopicResolver kafkaTopicResolver;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    /**
     * 📘 책 등록 이벤트 발행
     */
    public void sendBookCreatedEvent(BookCreatedDto event) {
        String topicName = kafkaTopicResolver.getBookCreatedTopic();
        sendMessage(topicName, event, "📘 BookCreatedEvent");
    }

    /**
     * 🤝 매칭 성공 이벤트 발행
     */
    public void sendMatchSuccessEvent(MatchSuccessDto event) {
        String topicName = kafkaTopicResolver.getMatchSuccessTopic();
        sendMessage(topicName, event, "🤝 MatchSuccessEvent");
    }

    /**
     * 📦 교환 완료 이벤트 발행
     */
    public void sendTradeSuccessEvent(TradeSuccessDto event) {
        String topicName = kafkaTopicResolver.getTradeSuccessTopic();
        sendMessage(topicName, event, "📦 TradeSuccessEvent");
    }

    /**
     * 💬 채팅 메시지 이벤트 발행
     */
    public void sendChatMessage(ChatMessageKafkaDto event) {
        String topicName = kafkaTopicResolver.getChatMessageTopic();
        log.info("📤 [KafkaProducer] Sending chat message to topic '{}': {}", topicName, event);
        sendMessage(topicName, event, "💬 ChatMessageEvent");
    }

    /**
     * 💚 로깅 메시지 이벤트 발행
     */
    public void sendRecommendEvent(RecommendMessageKafkaDto event) {
        String topicName = kafkaTopicResolver.getRecommendEventTopic();
        sendMessage(topicName, event, "💬 RecommendEvent");
    }

    /**
     * 🛠 공통 메시지 발행 메서드
     */
    private void sendMessage(String topicName, Object message, String eventName) {
        try {
            // 동적 토픽 이름으로 메시지 발송
            kafkaTemplate.send(topicName, message);
            log.info("{} Sent to topic '{}': {}", eventName, topicName, message);
        } catch (Exception e) {
            log.error("❌ Failed to send {} to topic '{}': {}", eventName, topicName, e.getMessage());
        }
    }
}