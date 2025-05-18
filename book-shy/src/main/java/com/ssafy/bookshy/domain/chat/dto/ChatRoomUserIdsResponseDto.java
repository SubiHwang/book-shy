package com.ssafy.bookshy.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ChatRoomUserIdsResponseDto {
    private Long userAId;
    private Long userBId;

    public static ChatRoomUserIdsResponseDto from(ChatRoomUserIds ids) {
        return ChatRoomUserIdsResponseDto.builder()
                .userAId(ids.getUserAId())
                .userBId(ids.getUserBId())
                .build();
    }
}
