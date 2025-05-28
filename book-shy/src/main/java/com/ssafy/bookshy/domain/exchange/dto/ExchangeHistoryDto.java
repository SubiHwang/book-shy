// ✅ 교환 히스토리 단건 응답 DTO
package com.ssafy.bookshy.domain.exchange.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExchangeHistoryDto {

    // 📌 거래 요청 ID
    private Long tradeId;

    // 🤝 상대방 닉네임 및 프로필
    private String counterpartNickname;
    private String counterpartProfileImageUrl;

    // 📍 장소 및 완료 시각
    private String place;
    private LocalDateTime completedAt;

    // 🔄 거래 타입 (EXCHANGE / RENTAL)
    private String tradeType;

    // 📚 내가 받은 책들
    private List<BookSummary> receivedBooks;

    // 📕 내가 건넨 책들
    private List<BookSummary> givenBooks;

    // ✅ 책 요약 정보 내부 클래스
    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BookSummary {
        private Long bookId;
        private String title;
        private String author;
        private String coverUrl;
    }
}