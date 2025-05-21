package com.ssafy.bookshy.domain.chat.entity;

import com.ssafy.bookshy.common.entity.TimeStampEntity;
import com.ssafy.bookshy.domain.chat.dto.ChatCalendarItemDto;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_calendar")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ChatCalendar extends TimeStampEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long calendarId;

    private String title;
    private String description;

    private LocalDateTime exchangeDate;
    private LocalDateTime rentalStartDate;
    private LocalDateTime rentalEndDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private ChatRoom chatRoom;

    private Long requestId;

    // ✏️ 일정 수정 메서드
    public void update(String title, String description,
                       LocalDateTime exchangeDate,
                       LocalDateTime rentalStartDate,
                       LocalDateTime rentalEndDate) {
        this.title = title;
        this.description = description;
        this.exchangeDate = exchangeDate;
        this.rentalStartDate = rentalStartDate;
        this.rentalEndDate = rentalEndDate;
    }
}
