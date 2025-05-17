package com.ssafy.bookshy.domain.notification.scheduler;

import com.ssafy.bookshy.domain.book.dto.BookListResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookListTotalResponseDto;
import com.ssafy.bookshy.domain.notification.service.NotificationService;
import com.ssafy.bookshy.domain.recommend.service.BookRecommendationService;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BookRecommendationScheduler {

    private final UserRepository userRepository;
    private final BookRecommendationService bookRecommendationService;
    private final NotificationService notificationService;

    // ⏰ 매일 오후 2시에 모든 사용자에게 추천 도서 알림 전송
    @Scheduled(cron = "0 0 14 * * *", zone = "Asia/Seoul")
    public void sendDailyBookRecommendation() {
        log.info("📚 [스케줄러] 도서 추천 알림 전송 시작");

        List<Users> users = userRepository.findAll();

        for (Users user : users) {
            try {
                BookListTotalResponseDto recs = bookRecommendationService.getAllRecommendations(user.getUserId());

                if (!recs.getBooks().isEmpty()) {
                    BookListResponseDto book = recs.getBooks().get(0); // 첫 번째 도서
                    notificationService.sendBookRecommendation(
                            user.getUserId(),
                            user.getNickname(),
                            book.getTitle(),
                            book.getItemId()
                    );
                    log.info("✅ 알림 전송 완료 - userId={}, itemId={}", user.getUserId(), book.getItemId());
                } else {
                    log.info("⛔ 추천 도서 없음 - userId={}", user.getUserId());
                }
            } catch (Exception e) {
                log.error("❌ 알림 전송 실패 - userId={}, 에러={}", user.getUserId(), e.getMessage());
            }
        }

        log.info("📚 [스케줄러] 도서 추천 알림 전송 완료");
    }
}
