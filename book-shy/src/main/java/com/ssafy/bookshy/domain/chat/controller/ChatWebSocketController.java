package com.ssafy.bookshy.domain.chat.controller;

import com.ssafy.bookshy.domain.chat.dto.ChatMessageRequestDto;
import com.ssafy.bookshy.kafka.dto.ChatMessageKafkaDto;
import com.ssafy.bookshy.kafka.producer.KafkaProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final KafkaProducer kafkaProducer;

    /**
     * 클라이언트에서 "/app/chat.send"로 메시지를 보낼 때 실행됨
     */
    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessageRequestDto requestDto) {
        ChatMessageKafkaDto kafkaDto = ChatMessageKafkaDto.builder()
                .chatRoomId(requestDto.getChatRoomId())
                .senderId(requestDto.getSenderId())
                .content(requestDto.getContent())
                .type(requestDto.getType())
                .build();
        kafkaProducer.sendChatMessage(kafkaDto);
    }

}
