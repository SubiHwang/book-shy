package com.ssafy.bookshy.kafka.consumer;

import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.chat.service.ChatMessageService;
import com.ssafy.bookshy.domain.chat.service.ChatRoomService;
import com.ssafy.bookshy.kafka.dto.BookCreatedDto;
import com.ssafy.bookshy.kafka.dto.MatchSuccessDto;
import com.ssafy.bookshy.kafka.dto.RecommendMessageKafkaDto;
import com.ssafy.bookshy.kafka.dto.TradeSuccessDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.xcontent.XContentType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * 📡 Kafka 이벤트를 수신하고 후속 처리를 담당하는 Consumer 서비스입니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaEventConsumer {

    private final ChatMessageService chatMessageService;
    private final ChatRoomService chatRoomService;
    private final SimpMessagingTemplate messagingTemplate;
    private final RestHighLevelClient elasticsearchClient;

    @Value("${app.developer.id}")
    private String developerId;

    @Value("${spring.profiles.active}")
    private String activeProfile;

    /**
     * 📘 책 등록 이벤트 수신 처리
     * - 토픽: book.created
     * - 도서 등록 관련 이벤트를 수신하고 처리하는 자리입니다.
     */
    @KafkaListener(topics = "#{@kafkaTopicResolver.getBookCreatedTopic()}", containerFactory = "bookListenerFactory")
    public void listenBookCreated(ConsumerRecord<String, BookCreatedDto> record, Acknowledgment ack) {
        try {
            BookCreatedDto event = record.value();
            log.info("📘 Book Created Event received: {}", event);

            // TODO: 책 등록 후처리 로직 작성 필요

            ack.acknowledge(); // ✅ 수동 커밋
        } catch (Exception e) {
            log.error("❌ Error processing book.created event: {}", record.value(), e);
        }
    }

    /**
     * 🤝 매칭 성공 이벤트 수신 처리
     * - 토픽: match.success
     * - 책 교환 매칭이 성사되었을 때 후처리를 위한 Consumer입니다.
     */
    @KafkaListener(topics = "#{@kafkaTopicResolver.getMatchSuccessTopic()}", containerFactory = "matchListenerFactory")
    public void listenMatchSuccess(ConsumerRecord<String, MatchSuccessDto> record, Acknowledgment ack) {
        try {
            MatchSuccessDto event = record.value();
            log.info("🤝 Match Success Event received: {}", event);

            // 🎯 채팅방 생성
            ChatRoom chatRoom = chatRoomService.createChatRoomFromMatch(event.getUserAId(), event.getUserBId());
            log.info("💬 ChatRoom created for matchId {} -> chatRoomId={}", event.getMatchId(), chatRoom.getId());

            // TODO: Matching - ChatRoom 연결 관계가 필요하다면 여기서 저장 (ex. matching.setChatRoomId(chatRoom.getId()))

            ack.acknowledge();
        } catch (Exception e) {
            log.error("❌ Error processing match.success event: {}", record.value(), e);
        }
    }

    /**
     * 📦 교환 완료 이벤트 수신 처리
     * - 토픽: trade.success
     * - 실제 책 교환이 완료되었을 때 발생하는 이벤트 처리
     */
    @KafkaListener(topics = "#{@kafkaTopicResolver.getTradeSuccessTopic()}", containerFactory = "tradeListenerFactory")
    public void listenTradeSuccess(ConsumerRecord<String, TradeSuccessDto> record, Acknowledgment ack) {
        try {
            TradeSuccessDto event = record.value();
            log.info("📦 Trade Success Event received: {}", event);

            // TODO: 교환 완료 후처리 로직 작성 필요

            ack.acknowledge();
        } catch (Exception e) {
            log.error("❌ Error processing trade.success event: {}", record.value(), e);
        }
    }

    /**
     * 💬 실시간 로깅 메시지 수신 처리
     * - 토픽: {developerId}-recommend.event
     */
    @KafkaListener(topics = "#{@kafkaTopicResolver.getChatMessageTopic()}", containerFactory = "chatListenerFactory")
    public void listenRecommendEvent(ConsumerRecord<String, RecommendMessageKafkaDto> record, Acknowledgment ack) {
        try {
            String topic = record.topic();
            RecommendMessageKafkaDto logDto = record.value();

            // 로그 데이터 추출
            Map<String, Object> logData = new HashMap<>();
            logData.put("eventType", logDto.getEventType());
            logData.put("eventData", logDto.getEventData());
            logData.put("timestamp", logDto.getTimestamp());

            // 인덱스 이름 결정
            String indexName = topic.replace("bookshy-", "").replace("-logs", "");

            // 단순한 문서 ID 생성 - 타임스탬프만 사용 (프로덕션에서는 이 정도면 충분)
            String docId = logDto.getEventType() + "-" + System.currentTimeMillis();

            try {
                // Elasticsearch에 저장
                IndexRequest indexRequest = new IndexRequest(indexName)
                        .id(docId)
                        .source(logData, XContentType.JSON);

                IndexResponse response = elasticsearchClient.index(indexRequest, RequestOptions.DEFAULT);
                log.debug("ES에 로그 저장 성공: id={}, index={}", response.getId(), indexName);

                // 처리 완료 후 ack (중요!)
                ack.acknowledge();
            } catch (IOException e) {
                // 응답 파싱 오류인 경우 저장 성공으로 간주
                if (e.getMessage().contains("Unable to parse response body") &&
                        e.getMessage().contains("201 Created")) {
                    log.debug("ES에 로그 저장 추정 성공 (응답 파싱 오류 무시): index={}", indexName);
                    ack.acknowledge(); // 여기서도 ack
                } else {
                    log.error("ES에 로그 저장 실패: index={}, error={}", indexName, e.getMessage());
                    // 심각한 오류가 아니라면 재시도하지 않음 (카프카가 자동으로 재시도)
                }
            }
        } catch (Exception e) {
            log.error("로그 처리 중 예상치 못한 오류: {}", e.getMessage());
        }
    }
}
