package com.ssafy.bookshy.domain.chat.service;

import com.ssafy.bookshy.domain.chat.dto.*;
import com.ssafy.bookshy.domain.chat.entity.ChatCalendar;
import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.chat.exception.ChatErrorCode;
import com.ssafy.bookshy.domain.chat.exception.ChatException;
import com.ssafy.bookshy.domain.chat.repository.ChatCalendarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatCalendarService {

    private final ChatCalendarRepository chatCalendarRepository;
    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * 📅 사용자의 특정 날짜 거래 일정 조회
     */
    public List<ChatCalendarEventDto> getCalendarEventsByDate(Long userId, LocalDate date) {
        List<ChatCalendar> calendars = chatCalendarRepository.findByUserIdAndDate(userId, date);
        return calendars.stream()
                .map(ChatCalendarEventDto::from)
                .collect(Collectors.toList());
    }

    /**
     * 📌 거래 일정 등록 (교환 or 대여)
     * - 입력값 유효성 검사
     * - 캘린더 저장
     * - 시스템 메시지 발송
     * - 실시간 브로드캐스트
     */
    @Transactional
    public ChatCalendarCreateResponseDto createCalendar(ChatCalendarCreateRequestDto dto, Long userId) {

        // 1️⃣ 거래 유형 유효성 검사
        if (!"EXCHANGE".equalsIgnoreCase(dto.getType()) && !"RENTAL".equalsIgnoreCase(dto.getType())) {
            throw new ChatException(ChatErrorCode.INVALID_CALENDAR_TYPE);
        }

        // 2️⃣ 필수 날짜 확인
        if ("EXCHANGE".equalsIgnoreCase(dto.getType()) && dto.getEventDate() == null) {
            throw new ChatException(ChatErrorCode.MISSING_EXCHANGE_DATE);
        }

        if ("RENTAL".equalsIgnoreCase(dto.getType()) &&
                (dto.getStartDate() == null || dto.getEndDate() == null)) {
            throw new ChatException(ChatErrorCode.MISSING_RENTAL_DATES);
        }

        // 3️⃣ ChatCalendar 생성 및 저장
        ChatCalendar calendar = ChatCalendar.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .exchangeDate(parseDateTimeOrNull(dto.getEventDate()))
                .rentalStartDate(parseDateTimeOrNull(dto.getStartDate()))
                .rentalEndDate(parseDateTimeOrNull(dto.getEndDate()))
                .chatRoom(ChatRoom.builder().id(dto.getRoomId()).build())
                .requestId(dto.getRequestId())
                .build();

        ChatCalendar saved = chatCalendarRepository.save(calendar);

        // 4️⃣ 시스템 메시지 저장
        String systemMessage = String.format("📌 일정 등록됨: %s", dto.getTitle());
        chatMessageService.saveMessage(ChatMessageRequestDto.builder()
                .chatRoomId(dto.getRoomId())
                .senderId(0L)
                .content(systemMessage)
                .type("info")
                .build(), userId);

        // 5️⃣ WebSocket 브로드캐스트
        ChatCalendarEventDto createdDto = ChatCalendarEventDto.from(saved);
        messagingTemplate.convertAndSend("/topic/calendar/" + dto.getRoomId(), createdDto);

        // 6️⃣ 응답 반환
        return ChatCalendarCreateResponseDto.builder()
                .eventId(saved.getCalendarId())
                .status("SUCCESS")
                .message("일정이 등록되었습니다.")
                .build();
    }

    /**
     * 📥 특정 채팅방의 거래 일정 단건 조회
     */
    public ChatCalendarEventDto getCalendarByRoomId(Long roomId) {
        ChatCalendar calendar = chatCalendarRepository.findByChatRoomId(roomId)
                .orElseThrow(() -> new ChatException(ChatErrorCode.CALENDAR_NOT_FOUND));
        return ChatCalendarEventDto.from(calendar);
    }

    private LocalDateTime parseDateTimeOrNull(String dateTimeStr) {
        return dateTimeStr == null ? null : LocalDateTime.parse(dateTimeStr);
    }
}
