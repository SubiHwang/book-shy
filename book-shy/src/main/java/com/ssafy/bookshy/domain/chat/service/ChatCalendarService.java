package com.ssafy.bookshy.domain.chat.service;

import com.ssafy.bookshy.domain.chat.dto.ChatCalendarEventDto;
import com.ssafy.bookshy.domain.chat.entity.ChatCalendar;
import com.ssafy.bookshy.domain.chat.repository.ChatCalendarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatCalendarService {

    private final ChatCalendarRepository chatCalendarRepository;

    public List<ChatCalendarEventDto> getCalendarEventsByDate(Long userId, LocalDate date) {
        List<ChatCalendar> calendars = chatCalendarRepository.findByUserIdAndDate(userId, date);
        return calendars.stream()
                .map(ChatCalendarEventDto::from)
                .collect(Collectors.toList());
    }
}