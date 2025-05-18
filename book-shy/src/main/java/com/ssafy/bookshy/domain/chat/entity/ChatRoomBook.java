package com.ssafy.bookshy.domain.chat.entity;

import jakarta.persistence.*;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomBook {

    private Long bookId;

    private String bookName;

    private Long userId; // 이 책의 소유자
}
