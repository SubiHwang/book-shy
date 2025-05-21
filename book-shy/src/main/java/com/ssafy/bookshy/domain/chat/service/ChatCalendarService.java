package com.ssafy.bookshy.domain.chat.service;

import com.ssafy.bookshy.domain.chat.dto.*;
import com.ssafy.bookshy.domain.chat.entity.ChatCalendar;
import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.chat.exception.ChatErrorCode;
import com.ssafy.bookshy.domain.chat.exception.ChatException;
import com.ssafy.bookshy.domain.chat.repository.ChatCalendarRepository;
import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequest;
import com.ssafy.bookshy.domain.exchange.repository.ExchangeRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatCalendarService {

    private final ChatCalendarRepository chatCalendarRepository;
    private final ChatMessageService chatMessageService;
    private final ExchangeRequestRepository exchangeRequestRepository;
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
     * 📌 거래 일정 + 요청 동시 등록 처리 메서드
     * - 거래 요청이 존재하지 않으면 생성
     * - 거래 일정 등록
     * - 시스템 메시지 및 실시간 알림 처리
     */
    @Transactional
    public ChatCalendarCreateResponseDto createCalendarWithRequest(ChatCalendarCreateRequestDto dto) {
        // 1️⃣ 거래 유형 유효성 검사
        String type = dto.getType();
        if (!"EXCHANGE".equalsIgnoreCase(type) && !"RENTAL".equalsIgnoreCase(type)) {
            throw new ChatException(ChatErrorCode.INVALID_CALENDAR_TYPE);
        }

        // 2️⃣ 날짜 유효성 검사
        if ("EXCHANGE".equalsIgnoreCase(type) && dto.getExchangeDate() == null) {
            throw new ChatException(ChatErrorCode.MISSING_EXCHANGE_DATE);
        }
        if ("RENTAL".equalsIgnoreCase(type) &&
                (dto.getStartDate() == null || dto.getEndDate() == null)) {
            throw new ChatException(ChatErrorCode.MISSING_RENTAL_DATES);
        }

        // 3️⃣ 사용자 ID 검증
        if (dto.getUserIds() == null || dto.getUserIds().size() != 2) {
            throw new ChatException(ChatErrorCode.INVALID_USER_IDS);
        }
        Long requesterId = dto.getUserIds().get(0);
        Long responderId = dto.getUserIds().get(1);

        // 4️⃣ 도서 ID 검증
        if (dto.getBookAId() == null || dto.getBookBId() == null) {
            throw new ChatException(ChatErrorCode.MISSING_BOOK_IDS);
        }

        // 5️⃣ 교환 요청 생성
        ExchangeRequest.RequestType requestType;
        try {
            requestType = ExchangeRequest.RequestType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ChatException(ChatErrorCode.INVALID_CALENDAR_TYPE);
        }

        ExchangeRequest request = ExchangeRequest.builder()
                .bookAId(dto.getBookAId())
                .bookBId(dto.getBookBId())
                .requesterId(requesterId)
                .responderId(responderId)
                .type(requestType)
                .build();
        exchangeRequestRepository.save(request);

        // 6️⃣ 일정 등록
        ChatCalendar calendar = ChatCalendar.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .exchangeDate(parseDateTimeOrNull(dto.getExchangeDate()))
                .rentalStartDate(parseDateTimeOrNull(dto.getStartDate()))
                .rentalEndDate(parseDateTimeOrNull(dto.getEndDate()))
                .chatRoom(ChatRoom.builder().id(dto.getRoomId()).build())
                .requestId(request.getRequestId())
                .build();

        ChatCalendar saved = chatCalendarRepository.save(calendar);

        // 7️⃣ 시스템 메시지 저장
        String systemMessage = String.format("📌 일정 등록됨: %s", dto.getTitle());
        chatMessageService.saveMessage(ChatMessageRequestDto.builder()
                .chatRoomId(dto.getRoomId())
                .senderId(0L)
                .content(systemMessage)
                .type("info")
                .build(), requesterId); // 보낸 사람은 요청자 기준으로 설정

        // 8️⃣ WebSocket 브로드캐스트
        ChatCalendarEventDto createdDto = ChatCalendarEventDto.from(saved);
        messagingTemplate.convertAndSend("/topic/calendar/" + dto.getRoomId(), createdDto);

        // 9️⃣ 응답 반환
        return ChatCalendarCreateResponseDto.builder()
                .eventId(saved.getCalendarId())
                .status("SUCCESS")
                .message("일정과 거래 요청이 등록되었습니다.")
                .build();
    }


    /**
     * 📥 특정 채팅방의 거래 일정 단건 조회
     */
    public ChatCalendarEventDto getCalendarByRoomId(Long roomId) {
        Optional<ChatCalendar> calendarOpt = chatCalendarRepository.findByChatRoomId(roomId);
        return calendarOpt.map(ChatCalendarEventDto::from).orElse(null);
    }

    private LocalDateTime parseDateTimeOrNull(String dateTimeStr) {
        return dateTimeStr == null ? null : LocalDateTime.parse(dateTimeStr);
    }

    /**
     * ❌ 특정 채팅방에 등록된 거래 일정을 삭제합니다.
     *
     * 📌 주요 동작:
     * - 채팅방 ID(roomId)를 기준으로 거래 일정을 조회합니다.
     * - 해당 일정이 존재하지 않으면 404 예외 발생
     * - 존재 시 삭제 수행
     *
     * 🔐 주로 일정 수정/삭제 또는 거래 취소 시 사용됩니다.
     *
     * @param roomId 삭제할 거래 일정의 채팅방 ID
     * @throws ChatException 일정이 존재하지 않는 경우
     */
    @Transactional
    public void deleteCalendarByRoomId(Long roomId) {
        ChatCalendar calendar = chatCalendarRepository.findByChatRoomId(roomId)
                .orElseThrow(() -> new ChatException(ChatErrorCode.NO_CALENDAR_FOUND));

        chatCalendarRepository.delete(calendar);
    }

    // ChatCalendarService.java 내부
    @Transactional
    public ChatCalendarCreateResponseDto updateCalendar(ChatCalendarUpdateRequestDto dto) {
        // 1️⃣ 거래 유형 확인
        String type = dto.getType();
        if (!"EXCHANGE".equalsIgnoreCase(type) && !"RENTAL".equalsIgnoreCase(type)) {
            throw new ChatException(ChatErrorCode.INVALID_CALENDAR_TYPE);
        }

        // 2️⃣ 날짜 유효성 확인
        if ("EXCHANGE".equalsIgnoreCase(type) && dto.getExchangeDate() == null) {
            throw new ChatException(ChatErrorCode.MISSING_EXCHANGE_DATE);
        }
        if ("RENTAL".equalsIgnoreCase(type) &&
                (dto.getStartDate() == null || dto.getEndDate() == null)) {
            throw new ChatException(ChatErrorCode.MISSING_RENTAL_DATES);
        }

        // 3️⃣ 일정 조회 및 존재 여부 확인
        ChatCalendar calendar = chatCalendarRepository.findById(dto.getCalendarId())
                .orElseThrow(() -> new ChatException(ChatErrorCode.NO_CALENDAR_FOUND));

        // 4️⃣ 거래 요청 조회 및 존재 여부 확인
        ExchangeRequest request = exchangeRequestRepository.findById(dto.getRequestId())
                .orElseThrow(() -> new ChatException(ChatErrorCode.EXCHANGE_REQUEST_NOT_FOUND));

        // 5️⃣ 거래 요청 정보 업데이트 (책 ID는 수정 불가, 날짜 및 메모만)
        request.updateType(ExchangeRequest.RequestType.valueOf(type));

        // 6️⃣ 일정 정보 수정
        calendar.update(
                dto.getTitle(),
                dto.getDescription(),
                parseDateTimeOrNull(dto.getExchangeDate()),
                parseDateTimeOrNull(dto.getStartDate()),
                parseDateTimeOrNull(dto.getEndDate())
        );

        // 7️⃣ WebSocket 알림
        ChatCalendarEventDto updatedDto = ChatCalendarEventDto.from(calendar);
        messagingTemplate.convertAndSend("/topic/calendar/" + calendar.getChatRoom().getId(), updatedDto);

        // 8️⃣ 응답 반환
        return ChatCalendarCreateResponseDto.builder()
                .eventId(calendar.getCalendarId())
                .status("SUCCESS")
                .message("일정과 거래 요청이 수정되었습니다.")
                .build();
    }
}
