package com.ssafy.bookshy.domain.matching.event;

import com.ssafy.bookshy.domain.matching.entity.Matching;
import com.ssafy.bookshy.kafka.dto.MatchSuccessDto;
import com.ssafy.bookshy.kafka.producer.KafkaProducer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

@Slf4j
@Component
@RequiredArgsConstructor
public class MatchingEventListener {

    private final KafkaProducer kafkaProducer;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleMatchCreated(MatchCreatedEvent event) {
        Matching match = event.getMatching();

        MatchSuccessDto dto = MatchSuccessDto.builder()
                .matchId(match.getMatchId())
                .userAId(match.getSenderId())
                .userBId(match.getReceiverId())
                .matchedAt(match.getMatchedAt().toString())
                .build();

        log.info("✅ AFTER_COMMIT: Sending Kafka MatchSuccessEvent for matchId={}", match.getMatchId());
        kafkaProducer.sendMatchSuccessEvent(dto);
    }
}
