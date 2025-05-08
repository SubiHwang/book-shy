package com.ssafy.bookshy.kafka.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.bookshy.domain.chat.dto.ChatMessageResponseDto;
import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.chat.service.ChatMessageService;
import com.ssafy.bookshy.domain.chat.service.ChatRoomService;
import com.ssafy.bookshy.kafka.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.xcontent.XContentType;
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

    private final ObjectMapper objectMapper;
    private final ChatMessageService chatMessageService;
    private final ChatRoomService chatRoomService;
    private final SimpMessagingTemplate messagingTemplate;

    private final RestHighLevelClient elasticsearchClient;


    /**
     * 📘 책 등록 이벤트 수신 처리
     * - 토픽: book.created
     * - 도서 등록 관련 이벤트를 수신하고 처리하는 자리입니다.
     */
    @KafkaListener(topics = "book.created", containerFactory = "bookListenerFactory")
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
    @KafkaListener(topics = "match.success", containerFactory = "matchListenerFactory")
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
    @KafkaListener(topics = "trade.success", containerFactory = "tradeListenerFactory")
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
     * 💬 실시간 채팅 메시지 수신 처리
     * - 토픽: chat.message
     * - Kafka를 통해 전달된 채팅 메시지를 DB에 저장하고,
     * 해당 채팅방 구독자들에게 WebSocket으로 전달합니다.
     */
    @KafkaListener(topics = "chat.message", containerFactory = "chatListenerFactory")
    public void listenChatMessage(ConsumerRecord<String, ChatMessageKafkaDto> record, Acknowledgment ack) {
        try {
            ChatMessageKafkaDto dto = record.value();
            log.info("💬 Received ChatMessageKafkaDto: {}", dto);

            // 💾 메시지를 DB에 저장
            ChatMessageResponseDto saved = chatMessageService.saveMessageFromKafka(dto);

            // 📢 해당 채팅방 구독자에게 메시지 전송
            String destination = "/topic/chat/" + dto.getChatRoomId();
            messagingTemplate.convertAndSend(destination, saved);

            ack.acknowledge(); // ✅ 메시지 정상 처리 후 커밋
        } catch (Exception e) {
            log.error("❌ Error in chat.message listener", e);
        }
    }

    /**
     * 💬 실시간 로깅 메시지 수신 처리
     * - 토픽: recommend.event
     */
    @KafkaListener(topics = "recommend.event", containerFactory = "recommendListenerFactory")
    public void listenRecommendEvent(ConsumerRecord<String, RecommendMessageKafkaDto> record, Acknowledgment ack) {
        try {
            String topic = record.topic();
            RecommendMessageKafkaDto logDto = record.value();

            // 로그 데이터 추출
            Map<String, Object> logData = new HashMap<>();
            logData.put("eventType", logDto.getEventType());
            logData.put("eventData", logDto.getEventData());
            logData.put("timestamp", logDto.getTimestamp());
            logData.put("userId", record.key()); // userId는 key로 전송됨

            // 인덱스 이름 결정 (토픽 이름에서 추출)
            String indexName = topic.replace("bookshy-", "").replace("-logs", "");

            log.debug("로그 소비 시작: topic={}, key={}", topic, record.key());

            // 인덱스 요청 생성
            IndexRequest indexRequest = new IndexRequest(indexName)
                    .source(logData, XContentType.JSON);

            try {
                // Elasticsearch에 저장
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
