package com.ssafy.bookshy.domain.chat.exception;

import com.ssafy.bookshy.common.response.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ChatErrorCode implements ErrorCode {

    // 🔹 거래 일정 관련
    MISSING_EXCHANGE_DATE(400, "📛 EXCHANGE 일정에는 eventDate가 필수입니다."),
    MISSING_RENTAL_DATES(400, "📛 RENTAL 일정에는 startDate와 endDate가 필요합니다."),
    INVALID_CALENDAR_TYPE(400, "❌ 거래 유형은 EXCHANGE 또는 RENTAL만 가능합니다."),
    CALENDAR_NOT_FOUND(404, "❌ 해당 채팅방의 거래 일정이 존재하지 않습니다."),

    // 🔹 거래 생성 관련 추가
    INVALID_USER_IDS(400, "👥 거래 요청에는 정확히 두 명의 사용자 ID가 필요합니다."),
    MISSING_BOOK_IDS(400, "📚 거래 요청에는 도서 A와 B의 ID가 모두 필요합니다."),

    // 🔹 채팅방 관련
    CHATROOM_NOT_FOUND(404, "❌ 채팅방을 찾을 수 없습니다."),
    CHATROOM_PARTICIPANT_NOT_FOUND(404, "❌ 채팅방의 참여자 정보를 찾을 수 없습니다."),
    CHATROOM_ALREADY_EXISTS(409, "⚠️ 동일한 구성의 채팅방이 이미 존재합니다."),

    // 🔹 메시지 관련
    MESSAGE_NOT_FOUND(404, "❌ 채팅 메시지를 찾을 수 없습니다."),
    UNAUTHORIZED_EMOJI_ACTION(403, "🚫 해당 이모지 변경 권한이 없습니다."),
    EMOJI_UPDATE_FAILED(400, "⚠️ 이모지 처리 중 오류가 발생했습니다."),

    // 🔹 기타
    INVALID_SENDER_ID(403, "🚫 메시지를 전송할 수 있는 권한이 없습니다."),
    INVALID_CHAT_REQUEST(400, "📛 잘못된 채팅 요청입니다."),
    WEBSOCKET_SUBSCRIPTION_ERROR(500, "💥 WebSocket 구독 처리 중 오류가 발생했습니다.");

    private final int status;
    private final String message;
}
