package com.ssafy.bookshy.domain.chat.dto;

import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomDto {
    private Long id;
    private Long participantId;
    private Long partnerId;
    private String partnerName;
    private String partnerProfileImage;
    private Float bookshyScore;
    private String lastMessage;
    private String lastMessageTime;
    private int unreadCount;

    // ✅ 추가 필드
    private List<Long> myBookId;
    private List<String> myBookName;
    private List<Long> otherBookId;
    private List<String> otherBookName;

    public static ChatRoomDto from(ChatRoom room,
                                   Long participantId,
                                   Long partnerId,
                                   String partnerName,
                                   String partnerProfileImage,
                                   Float bookshyScore,
                                   int unreadCount) {

        String lastMessage = room.getLastMessage();
        String lastMessageTime = room.getLastMessageTimestamp() != null
                ? room.getLastMessageTimestamp().toString()
                : "";

        // ✅ 책 정보 분기
        List<Long> myBookId = new ArrayList<>();
        List<String> myBookName = new ArrayList<>();
        List<Long> otherBookId = new ArrayList<>();
        List<String> otherBookName = new ArrayList<>();

        room.getBooks().forEach(book -> {
            if (book.getUserId().equals(participantId)) {
                myBookId.add(book.getBookId());
                myBookName.add(book.getBookName());
            } else {
                otherBookId.add(book.getBookId());
                otherBookName.add(book.getBookName());
            }
        });

        return ChatRoomDto.builder()
                .id(room.getId())
                .participantId(participantId)
                .partnerId(partnerId)
                .partnerName(partnerName)
                .partnerProfileImage(partnerProfileImage)
                .bookshyScore(bookshyScore)
                .lastMessage(lastMessage)
                .lastMessageTime(lastMessageTime)
                .unreadCount(unreadCount)
                .myBookId(myBookId)
                .myBookName(myBookName)
                .otherBookId(otherBookId)
                .otherBookName(otherBookName)
                .build();
    }
}
