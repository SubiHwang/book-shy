package com.ssafy.bookshy.domain.exchange.service;

import com.ssafy.bookshy.domain.exchange.dto.ExchangePromiseDto;
import com.ssafy.bookshy.domain.notification.dto.FcmNotificationType;
import com.ssafy.bookshy.domain.notification.service.NotificationService;
import com.ssafy.bookshy.domain.users.entity.Users;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExchangeReminderService {

    private final ExchangePromiseService exchangePromiseService;
    private final NotificationService notificationService;

    public void sendReminder(String subtype) {
        // 전체 사용자 반복
        List<Users> users = exchangePromiseService.getAllActiveUsersWithUpcomingPromise();
        LocalDate today = LocalDate.now();

        for (Users user : users) {
            List<ExchangePromiseDto> promiseList = exchangePromiseService.getPromiseList(user);
            for (ExchangePromiseDto promise : promiseList) {
                LocalDate promiseDate = LocalDate.parse(promise.getScheduledTime().substring(0, 10));

                boolean shouldNotify = switch (subtype) {
                    case "day_before" -> promiseDate.equals(today.plusDays(1));
                    case "today" -> promiseDate.equals(today);
                    default -> false;
                };

                if (shouldNotify) {
                    Map<String, String> data = new HashMap<>();
                    data.put("subtype", subtype);
                    data.put("targetName", promise.getCounterpart().getNickname());
                    data.put("date", promise.getScheduledTime().substring(0, 10));
                    data.put("type", promise.getType());
                    data.put("url", "/mypage");

                    notificationService.sendFcm(
                            user.getUserId(),
                            FcmNotificationType.TRANSACTION_DATE,
                            data
                    );
                }
            }
        }
    }

    public void sendReminderTestForce(Users user, String subtype) {
        List<ExchangePromiseDto> promiseList = exchangePromiseService.getPromiseList(user);

        for (ExchangePromiseDto promise : promiseList) {
            String date = promise.getScheduledTime().substring(0, 10);
            String type = promise.getType();

            Map<String, String> data = new HashMap<>();
            data.put("subtype", subtype);
            data.put("targetName", promise.getCounterpart().getNickname());
            data.put("date", date);
            data.put("type", type);
            data.put("url", "/mypage/promises");

            notificationService.sendFcm(
                    user.getUserId(),
                    FcmNotificationType.TRANSACTION_DATE,
                    data
            );
        }
    }
}
