package com.ssafy.bookshy.domain.notification.dto;

import java.util.Map;

public class FcmMessageTemplate {

    public static FcmMessage build(FcmNotificationType type, Map<String, String> data) {
        String title = "";
        String body = "";
        String url = "";

        switch (type) {
            case TRANSACTION_DATE -> {
                String subtype = data.get("subtype");       // now, day_before, today
                String targetName = data.get("targetName");
                String date = data.get("date");

                switch (subtype) {
                    case "now" -> {
                        title = "교환 날짜가 등록되었어요";
                        body = String.format("%s님과의 교환 날짜가 %s로 확정되었습니다. 잊지 마세요!", targetName, date);
                    }
                    case "day_before" -> {
                        title = "내일은 교환 약속이 있어요";
                        body = String.format("내일 %s님과의 교환이 예정되어 있습니다. 준비 되셨나요?", targetName);
                    }
                    case "today" -> {
                        title = "오늘 교환 약속이 있어요";
                        body = String.format("오늘 %s님과의 교환이 예정되어 있습니다. 잊지 않으셨죠?", targetName);
                    }
                }
                url = data.getOrDefault("url", "/mypage");
            }

            case CHAT_RECEIVE -> {
                title = String.format("\uD83D\uDCAC %s님에게서 새 메시지가 왔어요", data.get("senderNickName"));
                body = String.format("%s: %s", data.get("senderNickName"), data.get("content"));

                String chatRoomId = data.get("chatRoomId");
                if (chatRoomId != null && !chatRoomId.isBlank()) {
                    url = "/chat/" + chatRoomId;
                }
            }

            case MATCH_COMPLETE -> {
                title = "\uD83E\uDD1D 새로운 매칭이 성사되었어요";
                body = String.format("%s님과 매칭이 완료되었습니다. 지금 대화를 시작해 보세요!", data.get("partnerName"));

                String chatRoomId = data.get("chatRoomId");
                if (chatRoomId != null && !chatRoomId.isBlank()) {
                    url = "/chat/" + chatRoomId;
                }
            }

            case BOOK_RECOMMEND -> {
                title = String.format("\uD83D\uDCDA %s님, 이런 책은 어떤가요?", data.get("userName"));
                body = String.format("『%s』을(를) 추천해 드립니다. 지금 확인해 보세요!", data.get("bookTitle"));

                String itemId = data.get("itemId");
                if (itemId != null && !itemId.isBlank()) {
                    url = "/matching/books/" + itemId;
                }
            }
        }

        return new FcmMessage(title, body, url);
    }

    public record FcmMessage(String title, String body, String url) {}
}
