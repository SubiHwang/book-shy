package com.ssafy.bookshy.domain.chat.service;

import com.ssafy.bookshy.domain.chat.dto.*;
import com.ssafy.bookshy.domain.chat.entity.ChatMessage;
import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.chat.repository.ChatMessageRepository;
import com.ssafy.bookshy.domain.chat.repository.ChatRoomRepository;
import com.ssafy.bookshy.global.notification.NotificationService;
import com.ssafy.bookshy.domain.user.service.UserService; // 닉네임 조회를 위한 UserService
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserService userService; // senderNickname 조회용
    private final NotificationService notificationService; // 알림 전송용 (선택적)

    /**
     * 채팅방 목록 조회
     */
    public List<ChatRoomDto> getChatRooms(Long userId) {
        List<ChatRoom> rooms = chatRoomRepository.findByUserId(userId);
        return rooms.stream()
                .map(room -> {
                    Long partnerId = room.getUserAId().equals(userId) ? room.getUserBId() : room.getUserAId();
                    String partnerName = userService.getNicknameById(partnerId); // 예시
                    String partnerProfileImage = userService.getProfileImageById(partnerId); // 예시
                    return ChatRoomDto.from(room, userId, partnerId, partnerName, partnerProfileImage);
                })
                .collect(Collectors.toList());
    }

    /**
     * 특정 날짜에 대화한 채팅방 조회 (예: 거래 약속 캘린더)
     */
    public List<ChatRoomDto> getChatRoomsByDate(Long userId, LocalDate date) {
        List<ChatRoom> rooms = chatRoomRepository.findChatRoomsByUserIdAndDate(userId, date);
        return rooms.stream()
                .map(room -> {
                    Long partnerId = room.getUserAId().equals(userId) ? room.getUserBId() : room.getUserAId();
                    String partnerName = userService.getNicknameById(partnerId); // 예시
                    String partnerProfileImage = userService.getProfileImageById(partnerId); // 예시
                    return ChatRoomDto.from(room, userId, partnerId, partnerName, partnerProfileImage);
                })
                .collect(Collectors.toList());
    }

    /**
     * 채팅 메시지 조회
     */
    public List<ChatMessageResponseDto> getMessages(Long chatRoomId) {
        List<ChatMessage> messages = chatMessageRepository.findAllByChatRoomIdOrderByTimestampAsc(chatRoomId);
        return messages.stream()
                .map(msg -> {
                    String nickname = userService.getNicknameById(msg.getSenderId());
                    return ChatMessageResponseDto.from(msg, nickname);
                })
                .collect(Collectors.toList());
    }

    /**
     * 메시지 저장
     */
    @Transactional
    public ChatMessageResponseDto saveMessage(ChatMessageRequestDto request) {
        ChatRoom chatRoom = getChatRoomOrThrow(request.getChatRoomId());

        ChatMessage message = ChatMessage.builder()
                .chatRoom(chatRoom)
                .senderId(request.getSenderId())
                .content(request.getContent())
                .build();

        ChatMessage saved = chatMessageRepository.save(message);
        String nickname = userService.getNicknameById(saved.getSenderId());
        return ChatMessageResponseDto.from(saved, nickname);
    }

    /**
     * 메시지에 이모지 추가 (예: 좋아요)
     */
    @Transactional
    public void addEmojiToMessage(Long messageId, String emoji) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("메시지를 찾을 수 없습니다."));
        message.addEmoji(emoji);
    }

    /**
     * 채팅 알림 발송 (FCM 또는 알림 모듈 연동)
     */
    @Transactional
    public void notifyUserOnMessage(ChatNotificationRequestDto request) {
        notificationService.sendChatNotification(
                request.getReceiverId(),
                request.getContent()
        );
    }

    /**
     * 채팅방 조회 헬퍼 메서드
     */
    private ChatRoom getChatRoomOrThrow(Long chatRoomId) {
        return chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("채팅방이 존재하지 않습니다."));
    }
}
