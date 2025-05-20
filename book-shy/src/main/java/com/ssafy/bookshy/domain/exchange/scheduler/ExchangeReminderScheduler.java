package com.ssafy.bookshy.domain.exchange.scheduler;

import com.ssafy.bookshy.domain.exchange.service.ExchangeReminderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ExchangeReminderScheduler {

    private final ExchangeReminderService exchangeReminderService;

    // 매일 14시: 하루 전 알림
    @Scheduled(cron = "0 0 9 * * *", zone = "Asia/Seoul")
    public void sendDayBeforeReminders() {
        log.info("📆 하루 전 알림 스케줄러 실행");
        exchangeReminderService.sendReminder("day_before");
    }

    // 매일 09시: 당일 알림
    @Scheduled(cron = "0 0 14 * * *", zone = "Asia/Seoul")
    public void sendTodayReminders() {
        log.info("📆 당일 알림 스케줄러 실행");
        exchangeReminderService.sendReminder("today");
    }
}
