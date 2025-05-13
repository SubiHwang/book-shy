package com.ssafy.bookshy.domain.booktrip.dto;

import com.ssafy.bookshy.domain.booktrip.entity.BookTrip;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class BookTripWithUserDto extends BookTripDto {

    private UserProfile userProfile; // 👤 작성자 프로필 정보
    private boolean isMine;          // 🙋‍♂️ 현재 로그인한 사용자의 여정 여부

    @Builder(builderMethodName = "withUserBuilder")
    public BookTripWithUserDto(Long tripId, Long userId, Long bookId, String content, LocalDateTime createdAt,
                               String nickname, String profileImageUrl, boolean isMine) {
        super(tripId, userId, bookId, content, createdAt);
        this.userProfile = new UserProfile(nickname, profileImageUrl);
        this.isMine = isMine;
    }

    public static BookTripWithUserDto from(BookTrip trip, boolean isMine, String nickname, String profileImageUrl) {
        return BookTripWithUserDto.withUserBuilder()
                .tripId(trip.getTripId())
                .userId(trip.getUserId())
                .bookId(trip.getBookId())
                .content(trip.getContent())
                .createdAt(trip.getCreatedAt())
                .nickname(nickname)
                .profileImageUrl(profileImageUrl)
                .isMine(isMine)
                .build();
    }

    @Getter
    @AllArgsConstructor
    public static class UserProfile {
        private String nickname;
        private String profileImageUrl;
    }
}

