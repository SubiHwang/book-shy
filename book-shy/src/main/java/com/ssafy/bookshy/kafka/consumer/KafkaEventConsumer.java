package com.ssafy.bookshy.kafka.consumer;

import com.ssafy.bookshy.domain.chat.dto.ChatMessageResponseDto;
import com.ssafy.bookshy.domain.chat.dto.ChatRoomDto;
import com.ssafy.bookshy.domain.chat.dto.ChatRoomUserIds;
import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.chat.service.ChatMessageService;
import com.ssafy.bookshy.domain.chat.service.ChatRoomService;
import com.ssafy.bookshy.domain.notification.dto.ChatNotificationFcmDto;
import com.ssafy.bookshy.domain.notification.dto.MatchCompleteFcmDto;
import com.ssafy.bookshy.domain.notification.service.NotificationService;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import com.ssafy.bookshy.kafka.dto.*;
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
import java.util.Optional;

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
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Value("${app.developer.id}")
    private String developerId;

    @Value("${spring.profiles.active}")
    private String activeProfile;

    /**
     * 📘 책 등록 이벤트 수신 처리
     * - 토픽: {developerId}-book.created
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
     * - 토픽: {developerId}-match.success
     * - 책 교환 매칭이 성사되었을 때 후처리를 위한 Consumer입니다.
     */
    @KafkaListener(topics = "#{@kafkaTopicResolver.getMatchSuccessTopic()}", containerFactory = "matchListenerFactory")
    public void listenMatchSuccess(ConsumerRecord<String, MatchSuccessDto> record, Acknowledgment ack) {
        try {
            MatchSuccessDto event = record.value();
            log.info("🤝 Match Success Event received: {}", event);

            // 🔔 매칭 완료 알림 전송
            String senderName = userRepository.findById(event.getUserAId())
                    .map(Users::getNickname)
                    .orElse("상대방");

            notificationService.sendMatchCompleteNotification(
                    MatchCompleteFcmDto.builder()
                            .receiverId(event.getUserBId())
                            .partnerName(senderName)
                            .chatRoomId(chatRoom.getId())
                            .build()
            );

            ack.acknowledge();
        } catch (Exception e) {
            log.error("❌ Error processing match.success event: {}", record.value(), e);
        }
    }

    /**
     * 📦 교환 완료 이벤트 수신 처리
     * - 토픽: {developerId}-trade.success
     * - 실제 책 교환이 완료되었을 때 발생하는 이벤트 처리
     */
    @KafkaListener(topics = "#{@kafkaTopicResolver.getTradeSuccessTopic()}", containerFactory = "recommendListenerFactory")
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
     * - 토픽: {developerId}-chat.message
     * - Kafka를 통해 전달된 채팅 메시지를 DB에 저장하고,
     * 해당 채팅방 구독자들에게 WebSocket으로 전달합니다.
     */
    @KafkaListener(topics = "#{@kafkaTopicResolver.getChatMessageTopic()}", containerFactory = "chatListenerFactory")
    public void listenChatMessage(ConsumerRecord<String, ChatMessageKafkaDto> record, Acknowledgment ack) {
        try {
            ChatMessageKafkaDto dto = record.value();
            log.info("📥 [KafkaConsumer] Received ChatMessageKafkaDto from topic '{}': {}", record.topic(), dto);

            // 💾 메시지를 DB에 저장
            ChatMessageResponseDto saved = chatMessageService.saveMessageFromKafka(dto);
            log.info("💾 [KafkaConsumer] ChatMessage saved to DB: {}", saved);

            // 📢 해당 채팅방 구독자에게 메시지 전송
            String destination = "/topic/chat/" + dto.getChatRoomId();
            messagingTemplate.convertAndSend(destination, saved);
            log.info("📢 [KafkaConsumer] ChatMessage sent to WebSocket destination '{}'", destination);

            // 🔥 채팅 목록 갱신용 브로드캐스트
            ChatRoomUserIds userIds = chatRoomService.getUserIdsByChatRoomId(dto.getChatRoomId());
            Long senderId = dto.getSenderId();
            Long receiverId = userIds.getUserAId().equals(senderId)
                    ? userIds.getUserBId()
                    : userIds.getUserAId();

            // 👥 각 사용자에게 채팅 목록 갱신 WebSocket 전송
            ChatRoomDto chatRoomDto = chatRoomService.getChatRoomDtoByKafkaEvent(dto);

            messagingTemplate.convertAndSend("/topic/chat/user/" + senderId, chatRoomDto);
            messagingTemplate.convertAndSend("/topic/chat/user/" + receiverId, chatRoomDto);

            log.info("✅ [KafkaConsumer] 채팅 보낸이 Id: '{}', 받는이 Id: '{}'", senderId, receiverId);

            // FCM 알림 전송 (본인 제외 + 미리보기 길이 제한)
            if (!senderId.equals(receiverId)) {
                String senderName = userRepository.findById(senderId)
                        .map(Users::getNickname)
                        .orElse("알 수 없음");

                String preview = dto.getContent();
                if (preview.length() > 50) {
                    preview = preview.substring(0, 47) + "...";
                }

                notificationService.sendChatNotification(ChatNotificationFcmDto.builder()
                        .receiverId(receiverId)
                        .senderNickName(senderName)
                        .content(preview)
                        .chatRoomId(dto.getChatRoomId())
                        .build()
                );
            }

            ack.acknowledge(); // ✅ 커밋
            log.info("✅ [KafkaConsumer] Offset committed for topic '{}'", record.topic());
        } catch (Exception e) {
            log.error("❌ [KafkaConsumer] Error while processing chat.message", e);
        }
    }

    /**
     * 💬 실시간 로깅 메시지 수신 처리
     * - 프로덕션 환경(prod)이거나 developerId가 비어있으면 "recommend.event" 토픽을 사용
     * 그렇지 않으면 "{developerId}-recommend.event" 형식으로 토픽 이름 생성
     */
    @KafkaListener(topics = "#{@kafkaTopicResolver.getRecommendEventTopic()}", containerFactory = "recommendListenerFactory")
    public void listenRecommendEvent(ConsumerRecord<String, RecommendMessageKafkaDto> record, Acknowledgment ack) {
        try {
            String topic = record.topic();
            RecommendMessageKafkaDto logDto = record.value();

            log.info("🚀 Kafka 메시지 수신 시작 - 토픽: {}, 이벤트타입: {}", topic, logDto.getEventType());

            // 로그 데이터 추출
            Map<String, Object> logData = new HashMap<>();
            logData.put("eventType", logDto.getEventType());
            logData.put("eventData", logDto.getEventData());
            logData.put("timestamp", logDto.getTimestamp());

            // 💥 여기에 상세 로그 추가!
            log.info("🔍 받은 메시지 정보: 토픽={}, 파티션={}, 오프셋={}, 이벤트타입={}, 아이템ID={}, 타임스탬프={}",
                    record.topic(),
                    record.partition(),
                    record.offset(),
                    logDto.getEventType(),
                    logDto.getEventData().get("itemId"),
                    logDto.getTimestamp());

            log.info("🔧 현재 설정 - developerId: {}, activeProfile: {}", developerId, activeProfile);

            // 인덱스 이름 - 공통 인덱스 사용
            String indexName = "recommend.event";

            // 단순한 문서 ID 생성 - 타임스탬프만 사용 (프로덕션에서는 이 정도면 충분)
            String docId = logDto.getEventType() + "-" + System.currentTimeMillis();

            log.info("📝 ES 저장 준비 - 인덱스: {}, 문서ID: {}", indexName, docId);

            try {
                // 개발자 ID가 'subi'이거나 서버 환경일 경우에는
                if ("subi".equals(developerId) || "prod".equals(activeProfile)) {
                    log.info("✅ ES 저장 조건 충족: developerId={}, activeProfile={}", developerId, activeProfile);

                    // Elasticsearch에 저장
                    IndexRequest indexRequest = new IndexRequest(indexName)
                            .id(docId)
                            .source(logData, XContentType.JSON);

                    log.info("📤 ES 인덱싱 요청 전송 중...");
                    IndexResponse response = elasticsearchClient.index(indexRequest, RequestOptions.DEFAULT);

                    log.info("✨ ES에 로그 저장 성공: id={}, index={}, result={}",
                            response.getId(), indexName, response.getResult());
                } else {
                    // 다른 개발자인 경우 저장하지 않고 로그만 남김
                    log.info("⏭️ 개발자 ID '{}'는 'subi'가 아니므로 ES 저장 스킵", developerId);
                }

                // 모든 경우에 메시지 처리 완료로 표시
                log.info("✅ Kafka 메시지 처리 완료 - ACK 전송");
                ack.acknowledge();

            } catch (IOException e) {
                log.error("❌ ES 저장 중 IOException 발생: {}", e.getMessage());

                // 응답 파싱 오류인 경우 저장 성공으로 간주
                if (e.getMessage().contains("Unable to parse response body") &&
                        e.getMessage().contains("201 Created")) {
                    log.info("⚠️ ES에 로그 저장 추정 성공 (응답 파싱 오류 무시): index={}", indexName);
                    ack.acknowledge();
                } else {
                    log.error("❌ ES에 로그 저장 실패: index={}, error={}", indexName, e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("💥 로그 처리 중 예상치 못한 오류: ", e);
        }
    }
}
