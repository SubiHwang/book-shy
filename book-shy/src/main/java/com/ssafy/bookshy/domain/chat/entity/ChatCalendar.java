package com.ssafy.bookshy.domain.chat.entity;

import com.ssafy.bookshy.common.entity.TimeStampEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_calendar")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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

    private Long requestId; // 거래 요청 식별자
}
