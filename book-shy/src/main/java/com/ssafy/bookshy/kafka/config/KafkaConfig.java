package com.ssafy.bookshy.kafka.config;

import com.ssafy.bookshy.kafka.dto.BookCreatedDto;
import com.ssafy.bookshy.kafka.dto.ChatMessageKafkaDto;
import com.ssafy.bookshy.kafka.dto.MatchSuccessDto;
import com.ssafy.bookshy.kafka.dto.TradeSuccessDto;
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

@EnableKafka
@Configuration
@RequiredArgsConstructor
public class KafkaConfig {

    private final Environment env;

    @Bean
    public Map<String, Object> producerConfig() {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, env.getProperty("spring.kafka.bootstrap-servers"));
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        // 클래스 정보 포함하지 않음 (역직렬화 오류 방지)
        props.put(JsonSerializer.ADD_TYPE_INFO_HEADERS, false);
        return props;
    }

    /**
     * 제네릭 Kafka ProducerFactory (모든 DTO에서 재사용 가능)
     */
    @Bean
    public <T> ProducerFactory<String, T> producerFactory() {
        JsonSerializer<T> jsonSerializer = new JsonSerializer<>();
        jsonSerializer.setAddTypeInfo(false);

        return new DefaultKafkaProducerFactory<>(
                producerConfig(),
                new StringSerializer(),
                jsonSerializer
        );
    }

    /**
     * 제네릭 KafkaTemplate (필요 시 명시적 타입으로 주입 가능)
     */
    @Bean
    public <T> KafkaTemplate<String, T> kafkaTemplate(ProducerFactory<String, T> producerFactory) {
        return new KafkaTemplate<>(producerFactory);
    }

    // BookCreatedDto용 ConsumerFactory
    @Bean
    public ConsumerFactory<String, BookCreatedDto> bookConsumerFactory() {
        JsonDeserializer<BookCreatedDto> deserializer = new JsonDeserializer<>(BookCreatedDto.class);
        deserializer.setRemoveTypeHeaders(false);
        deserializer.addTrustedPackages("*");
        deserializer.setUseTypeMapperForKey(true);

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, env.getProperty("spring.kafka.bootstrap-servers"));
        props.put(ConsumerConfig.GROUP_ID_CONFIG, env.getProperty("KAFKA.CONSUMER.BOOK-GROUP-ID"));
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);

        return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), deserializer);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, BookCreatedDto> bookListenerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, BookCreatedDto> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(bookConsumerFactory());
        factory.setConcurrency(3);
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL_IMMEDIATE);
        return factory;
    }

    // MatchSuccessDto용 ConsumerFactory
    @Bean
    public ConsumerFactory<String, MatchSuccessDto> matchConsumerFactory() {
        JsonDeserializer<MatchSuccessDto> deserializer = new JsonDeserializer<>(MatchSuccessDto.class);
        deserializer.addTrustedPackages("*");

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, env.getProperty("spring.kafka.bootstrap-servers"));
        props.put(ConsumerConfig.GROUP_ID_CONFIG, env.getProperty("KAFKA.CONSUMER.MATCH-GROUP-ID"));
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);

        return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), deserializer);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, MatchSuccessDto> matchListenerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, MatchSuccessDto> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(matchConsumerFactory());
        factory.setConcurrency(3);
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL_IMMEDIATE);
        return factory;
    }

    // TradeSuccessDto용 ConsumerFactory
    @Bean
    public ConsumerFactory<String, TradeSuccessDto> tradeConsumerFactory() {
        JsonDeserializer<TradeSuccessDto> deserializer = new JsonDeserializer<>(TradeSuccessDto.class);
        deserializer.addTrustedPackages("*");

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, env.getProperty("spring.kafka.bootstrap-servers"));
        props.put(ConsumerConfig.GROUP_ID_CONFIG, env.getProperty("KAFKA.CONSUMER.TRADE-GROUP-ID"));
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);

        return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), deserializer);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, TradeSuccessDto> tradeListenerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, TradeSuccessDto> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(tradeConsumerFactory());
        factory.setConcurrency(3);
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL_IMMEDIATE);
        return factory;
    }

    // ChatMessageKafkaDto용 ConsumerFactory
    @Bean
    public ConsumerFactory<String, ChatMessageKafkaDto> chatConsumerFactory() {
        JsonDeserializer<ChatMessageKafkaDto> deserializer = new JsonDeserializer<>(ChatMessageKafkaDto.class);
        deserializer.addTrustedPackages("*");

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, env.getProperty("spring.kafka.bootstrap-servers"));
        props.put(ConsumerConfig.GROUP_ID_CONFIG, env.getProperty("KAFKA.CONSUMER.CHAT-GROUP-ID"));
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);

        return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), deserializer);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, ChatMessageKafkaDto> chatListenerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, ChatMessageKafkaDto> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(chatConsumerFactory());
        factory.setConcurrency(3);
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL_IMMEDIATE);
        return factory;
    }

}
