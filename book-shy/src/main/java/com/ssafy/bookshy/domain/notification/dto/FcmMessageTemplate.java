package com.ssafy.bookshy.domain.notification.dto;

import java.util.Map;

public class FcmMessageTemplate {

    public static FcmMessage build(FcmNotificationType type, Map<String, String> data) {
        String title = "";
        String body = "";
        String url = "";

        switch (type) {
            case TRANSACTION_DATE -> {
                String subtype = data.get("subtype");
                String targetName = data.get("targetName");
                String date = data.get("date");
                String rawType = data.getOrDefault("type", "EXCHANGE");

                if (subtype == null || targetName == null || date == null) {
                    title = "📆 약속 알림 오류";
                    body = "알림 생성에 필요한 정보가 누락되었습니다.";
                } else {
                    String typeName;
                    switch (rawType.toUpperCase()) {
                        case "RENTAL":
                            typeName = "대여";
                            break;
                        case "EXCHANGE":
                        default:
                            typeName = "교환";
                            break;
                    }

                    switch (subtype) {
                        case "now":
                            title = typeName + " 날짜가 등록되었어요";
                            body = String.format("%s님과의 %s 날짜가 %s로 확정되었습니다.", targetName, typeName, date);
                            break;
                        case "day_before":
                            title = "내일은 " + typeName + " 약속이 있어요";
                            body = String.format("내일 %s님과의 %s이(가) 예정되어 있습니다.", targetName, typeName);
                            break;
                        case "today":
                            title = "오늘 " + typeName + " 약속이 있어요";
                            body = String.format("오늘 %s님과의 %s이(가) 예정되어 있습니다.", targetName, typeName);
                            break;
                        default:
                            title = "알림 유형 오류";
                            body = "지원하지 않는 subtype입니다.";
                            break;
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
                    url = "/matching/books/" + itemId + "?from=wish-book-card";
                }
            }
        }

        return new FcmMessage(title, body, url);
    }

    public record FcmMessage(String title, String body, String url) {}
}
