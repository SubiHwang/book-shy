package com.ssafy.bookshy.kafka.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Kafka 토픽 이름을 동적으로 결정하는 헬퍼 클래스
 */
@Component
public class KafkaTopicResolver {

    @Value("${app.developer.id:unknown}")
    private String developerId;

    @Value("${spring.profiles.active:unknown}")
    private String activeProfile;

    /**
     * recommend.event 토픽 이름 결정
     */
    public String getRecommendEventTopic() {
        if ("prod".equals(activeProfile) || developerId == null || developerId.isEmpty()) {
            return "recommend.event";
        } else {
            return developerId + "-recommend.event";
        }
    }

    /**
     * book.created 토픽 이름 결정
     */
    public String getBookCreatedTopic() {
        if ("prod".equals(activeProfile) || developerId == null || developerId.isEmpty()) {
            return "book.created";
        } else {
            return developerId + "-book.created";
        }
    }

    /**
     * match.success 토픽 이름 결정
     */
    public String getMatchSuccessTopic() {
        if ("prod".equals(activeProfile) || developerId == null || developerId.isEmpty()) {
            return "match.success";
        } else {
            return developerId + "-match.success";
        }
    }

    /**
     * trade.success 토픽 이름 결정
     */
    public String getTradeSuccessTopic() {
        if ("prod".equals(activeProfile) || developerId == null || developerId.isEmpty()) {
            return "trade.success";
        } else {
            return developerId + "-trade.success";
        }
    }

    /**
     * chat.message 토픽 이름 결정
     */
    public String getChatMessageTopic() {
        if ("prod".equals(activeProfile) || developerId == null || developerId.isEmpty()) {
            return "chat.message";
        } else {
            return developerId + "-chat.message";
        }
    }
}