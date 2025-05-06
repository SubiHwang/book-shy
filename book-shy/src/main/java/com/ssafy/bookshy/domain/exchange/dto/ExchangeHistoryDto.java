package com.ssafy.bookshy.domain.exchange.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 완료된 교환 내역의 단일 항목을 표현하는 DTO입니다.
 * 사용자 기준으로 상대방 정보, 받은 책, 완료 시간, 장소 정보를 포함합니다.
 */
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExchangeHistoryDto {

    // 교환 요청 ID (거래 ID 대체)
    private Long tradeId;

    // 상대방 닉네임 및 프로필 이미지
    private String counterpartNickname;
    private String counterpartProfileImageUrl;

    // 거래 장소 및 완료 시각
    private String place;
    private LocalDateTime completedAt;

    // 거래 타입 (교환 or 대여/반납)
    private String tradeType;

    // 내가 받은 책 정보
    private String receivedBookTitle;
    private String receivedBookAuthor;
    private String receivedBookCoverUrl;

    // 내가 건네준 책 정보
    private String givenBookTitle;
    private String givenBookAuthor;
    private String givenBookCoverUrl;
}
