package com.ssafy.bookshy.kafka.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.bookshy.kafka.dto.MatchSuccessDto;
//import com.locket.user.service.payment.PaymentProcessingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookEventConsumer {
//    private final PaymentProcessingService paymentProcessingService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "payment.success")
    public void listenPaymentSuccess(ConsumerRecord<String, MatchSuccessDto> record, Acknowledgment ack) {
        try {
            MatchSuccessDto paymentEvent = record.value();
            log.info("📥 Received Payment Success Event: {}", paymentEvent);

            // ✅ 결제 성공 이벤트 처리 (DB 및 ElasticSearch 저장)
//            paymentProcessingService.processPaymentSuccess(paymentEvent);

            // ✅ Kafka 오프셋 커밋
            ack.acknowledge();
        } catch (Exception e) {
            log.error("❌ Error processing payment success event: {}", record.value(), e);
            // ❗ 예외 발생 시 ack.acknowledge()를 호출하지 않으면 Kafka가 자동 재시도
        }
    }
}
