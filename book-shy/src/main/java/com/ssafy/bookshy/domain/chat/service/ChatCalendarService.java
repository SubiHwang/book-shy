package com.ssafy.bookshy.domain.chat.service;

import com.ssafy.bookshy.domain.chat.dto.*;
import com.ssafy.bookshy.domain.chat.entity.ChatCalendar;
import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.chat.repository.ChatCalendarRepository;
import lombok.RequiredArgsConstructor;
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

    /**
     * 📆 특정 날짜에 해당하는 사용자의 거래 일정을 조회합니다.
     * @param userId 사용자 ID
     * @param date 조회할 날짜
     * @return 해당 날짜의 거래 일정 목록
     */
    public List<ChatCalendarEventDto> getCalendarEventsByDate(Long userId, LocalDate date) {
        List<ChatCalendar> calendars = chatCalendarRepository.findByUserIdAndDate(userId, date);
        return calendars.stream()
                .map(ChatCalendarEventDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public ChatCalendarCreateResponseDto createCalendar(ChatCalendarCreateRequestDto dto) {
        // ✅ 거래 유형 유효성 검사 및 날짜 필드 검증
        if ("EXCHANGE".equalsIgnoreCase(dto.getType())) {
            if (dto.getEventDate() == null) {
                throw new IllegalArgumentException("📛 EXCHANGE 일정에는 eventDate가 필수입니다.");
            }
        } else if ("RENTAL".equalsIgnoreCase(dto.getType())) {
            if (dto.getStartDate() == null || dto.getEndDate() == null) {
                throw new IllegalArgumentException("📛 RENTAL 일정에는 startDate와 endDate가 필요합니다.");
            }
        } else {
            throw new IllegalArgumentException("❌ 거래 유형은 EXCHANGE 또는 RENTAL만 가능합니다.");
        }

        // ✅ ChatCalendar 엔티티 생성 및 저장
        ChatCalendar calendar = ChatCalendar.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .exchangeDate(parseDateTimeOrNull(dto.getEventDate()))
                .rentalStartDate(parseDateTimeOrNull(dto.getStartDate()))
                .rentalEndDate(parseDateTimeOrNull(dto.getEndDate()))
                .chatRoom(ChatRoom.builder().id(dto.getRoomId()).build()) // 💡 실제로는 repository에서 조회 권장
                .requestId(dto.getRequestId())
                .build();

        ChatCalendar saved = chatCalendarRepository.save(calendar);

        // ✅ 일정 등록 알림 메시지 전송
        String systemMessage = String.format("📌 일정 등록됨: %s", dto.getTitle());
        chatMessageService.saveMessage(ChatMessageRequestDto.builder()
                .chatRoomId(dto.getRoomId())
                .senderId(0L)  // 0 또는 시스템 ID
                .content(systemMessage)
                .type("info")
                .build());

        // ✅ 응답 반환
        return ChatCalendarCreateResponseDto.builder()
                .eventId(saved.getCalendarId())
                .status("SUCCESS")
                .message("일정이 등록되었습니다.")
                .build();
    }

    private LocalDateTime parseDateTimeOrNull(String dateTimeStr) {
        return dateTimeStr == null ? null : LocalDateTime.parse(dateTimeStr);
    }


}