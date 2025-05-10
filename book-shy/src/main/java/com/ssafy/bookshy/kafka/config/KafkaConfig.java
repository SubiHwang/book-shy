package com.ssafy.bookshy.kafka.config;

import com.ssafy.bookshy.kafka.dto.*;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.*;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.HashMap;
import java.util.Map;

/**
 * 📡 Kafka 설정 클래스
 * - Producer / Consumer Factory 및 ListenerContainerFactory 설정
 * - 재사용 가능한 Generic Factory 메서드를 활용하여 중복 제거
 */
@EnableKafka
@Configuration
@RequiredArgsConstructor
public class KafkaConfig {

    private final Environment env;

    /**
     * ✅ 공통 Producer 설정
     */
    @Bean
    public Map<String, Object> producerConfig() {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, env.getProperty("spring.kafka.bootstrap-servers"));
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        props.put(JsonSerializer.ADD_TYPE_INFO_HEADERS, false); // 타입 헤더 생략
        return props;
    }

    /**
     * ✅ Generic ProducerFactory
     */
    @Bean
    public <T> ProducerFactory<String, T> producerFactory() {
        return new DefaultKafkaProducerFactory<>(producerConfig());
    }

    /**
     * ✅ Generic KafkaTemplate
     */
    @Bean
    public <T> KafkaTemplate<String, T> kafkaTemplate(ProducerFactory<String, T> producerFactory) {
        return new KafkaTemplate<>(producerFactory);
    }

    /**
     * ✅ 공통 Consumer 설정
     */
    private Map<String, Object> baseConsumerProps(String groupId) {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, env.getProperty("spring.kafka.bootstrap-servers"));
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        return props;
    }

    /**
     * ✅ Generic ConsumerFactory
     */
    private <T> ConsumerFactory<String, T> consumerFactory(Class<T> clazz, String groupId) {
        JsonDeserializer<T> deserializer = new JsonDeserializer<>(clazz);
        deserializer.addTrustedPackages("*");
        deserializer.setRemoveTypeHeaders(false);
        deserializer.setUseTypeMapperForKey(true);
        return new DefaultKafkaConsumerFactory<>(baseConsumerProps(groupId), new StringDeserializer(), deserializer);
    }

    /**
     * ✅ Generic ListenerFactory
     */
    private <T> ConcurrentKafkaListenerContainerFactory<String, T> listenerFactory(Class<T> clazz, String groupId) {
        ConcurrentKafkaListenerContainerFactory<String, T> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory(clazz, groupId));
        // 환경에 따라 concurrency 값 조정
        if ("prod".equals(env.getProperty("spring.profiles.active"))) {
            factory.setConcurrency(1);  // 프로덕션 환경에서는 1개만 사용
        } else {
            factory.setConcurrency(3);  // 개발 환경에서는 3개 사용 (기존과 동일)
        }
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL_IMMEDIATE);
        return factory;
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, BookCreatedDto> bookListenerFactory() {
        return listenerFactory(BookCreatedDto.class, env.getProperty("spring.kafka.consumer.book-group-id"));
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, MatchSuccessDto> matchListenerFactory() {
        return listenerFactory(MatchSuccessDto.class, env.getProperty("spring.kafka.consumer.match-group-id"));
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, TradeSuccessDto> tradeListenerFactory() {
        return listenerFactory(TradeSuccessDto.class, env.getProperty("spring.kafka.consumer.trade-group-id"));
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, ChatMessageKafkaDto> chatListenerFactory() {
        return listenerFactory(ChatMessageKafkaDto.class, env.getProperty("spring.kafka.consumer.chat-group-id"));
    }

    //recommend 그룹을 생성함
    //"RecommendMessageKafkaDto 메시지를 주고받음"
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, RecommendMessageKafkaDto> recommendListenerFactory() {
        //env.getProperty("spring.kafka.consumer.recommend-group-id")에서 그룹 ID를 가져옴
        return listenerFactory(RecommendMessageKafkaDto.class, env.getProperty("spring.kafka.consumer.recommend-group-id"));
    }

}
