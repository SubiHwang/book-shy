package com.ssafy.bookshy.kafka.config;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;

import com.ssafy.bookshy.kafka.dto.MatchSuccessDto;

@EnableKafka
@Configuration
public class KafkaConfig {

    private final Environment env;

    KafkaConfig(Environment environment) {
        this.env = environment;
    }

    @Bean
    public Map<String, Object> producerConfig() {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, env.getProperty("spring.kafka.bootstrap-servers"));
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class); // ✅ StringSerializer 지정
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class); // ✅ JsonSerializer 명시
        return props;
    }

    @Bean
    public ProducerFactory<String, MatchSuccessDto> producerFactory() {
        JsonSerializer<MatchSuccessDto> jsonSerializer = new JsonSerializer<>();
        jsonSerializer.setAddTypeInfo(false); // ✅ @class 정보 제거 (역직렬화 오류 방지)

        return new DefaultKafkaProducerFactory<>(
                this.producerConfig(),
                new StringSerializer(),
                jsonSerializer
        );
    }

    @Bean
    public KafkaTemplate<String, MatchSuccessDto> kafkaTemplate() {
        return new KafkaTemplate<>(this.producerFactory());
    }
}