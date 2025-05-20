package com.ssafy.bookshy.domain.chat.service;

import com.ssafy.bookshy.domain.book.dto.BookResponseDto;
import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.book.repository.BookRepository;
import com.ssafy.bookshy.domain.chat.dto.ChatOpponentResponseDto;
import com.ssafy.bookshy.domain.chat.dto.ChatRoomDto;
import com.ssafy.bookshy.domain.chat.dto.ChatRoomUserIds;
import com.ssafy.bookshy.domain.chat.entity.ChatCalendar;
import com.ssafy.bookshy.domain.chat.entity.ChatMessage;
import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.chat.entity.ChatRoomBook;
import com.ssafy.bookshy.domain.chat.exception.ChatErrorCode;
import com.ssafy.bookshy.domain.chat.exception.ChatException;
import com.ssafy.bookshy.domain.chat.repository.ChatCalendarRepository;
import com.ssafy.bookshy.domain.chat.repository.ChatMessageRepository;
import com.ssafy.bookshy.domain.chat.repository.ChatRoomRepository;
import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequest;
import com.ssafy.bookshy.domain.exchange.repository.ExchangeRequestRepository;
import com.ssafy.bookshy.domain.matching.dto.MatchChatRequestDto;
import com.ssafy.bookshy.domain.matching.entity.Matching;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.exception.UserErrorCode;
import com.ssafy.bookshy.domain.users.exception.UserException;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import com.ssafy.bookshy.domain.users.service.UserService;
import com.ssafy.bookshy.kafka.dto.ChatMessageKafkaDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 💬 채팅방 관련 비즈니스 로직을 처리하는 서비스 클래스
 *
 * 주요 기능:
 * - 채팅방 목록 조회
 * - 매칭 기반 채팅방 생성
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserService userService;
    private final ExchangeRequestRepository exchangeRequestRepository;
    private final BookRepository bookRepository;
    private final ChatCalendarRepository chatCalendarRepository;
    private final UserRepository userRepository;

    /**
     * 📋 특정 사용자의 채팅방 목록을 조회합니다.
     *
     * - 참여 중인 모든 채팅방을 조회
     * - 상대방 정보 (이름, 프로필), 안 읽은 메시지 수 포함
     *
     * @param userId 현재 로그인된 사용자 ID
     * @return 채팅방 목록 DTO 리스트
     */
    public List<ChatRoomDto> getChatRooms(Long userId) {
        // 🔍 1. 해당 사용자가 포함된 채팅방 전체 조회
        List<ChatRoom> rooms = chatRoomRepository.findByUserId(userId);

        // 🎁 2. 각 채팅방에 대해 DTO 변환
        return rooms.stream()
                .map(room -> {
                    // 상대방 ID 결정
                    Long partnerId = room.getUserAId().equals(userId)
                            ? room.getUserBId()
                            : room.getUserAId();

                    // 상대방 사용자 정보 조회
                    Users partner = userService.getUserById(partnerId);

                    // 📩 안 읽은 메시지 수 계산
                    int unreadCount = chatMessageRepository.countUnreadMessages(room.getId(), userId);

                    // ✅ DTO 생성 및 반환
                    return ChatRoomDto.from(
                            room,
                            userId, // 내 userId
                            partnerId,
                            partner.getNickname(),
                            partner.getProfileImageUrl(),
                            partner.getTemperature(), // bookshyScore로 사용됨
                            unreadCount
                    );

                })
                .collect(Collectors.toList());
    }

    /**
     * 🧩 두 사용자의 매칭 기반으로 채팅방을 생성합니다.
     *
     * - 이미 존재하는 채팅방이 있다면 해당 채팅방을 반환합니다.
     * - 존재하지 않으면 새로운 채팅방을 생성하고,
     *   참여자 각각의 도서 정보를 함께 저장합니다.
     * - 생성 시 시스템 안내 메시지를 notice 타입으로 함께 추가하고,
     *   마지막 메시지 정보를 초기화합니다.
     *
     * @param matchId 매칭 ID
     * @param dto 채팅방 정보

     * @return 생성되거나 기존의 ChatRoom 객체
     */
    @Transactional
    public ChatRoom createChatRoomFromMatch(Long matchId, MatchChatRequestDto dto) {
        Long senderId = dto.getSenderId();
        Long receiverId = dto.getReceiverId();

        // 🔍 1. 기존 채팅방 존재 여부 확인
        Optional<ChatRoom> existing = chatRoomRepository.findByParticipants(senderId, receiverId);
        if (existing.isPresent()) {
            return existing.get();
        }

        // 📚 2. 책 정보 매핑
        List<ChatRoomBook> books = new ArrayList<>();

        for (int i = 0; i < dto.getMyBookId().size(); i++) {
            books.add(ChatRoomBook.builder()
                    .bookId(dto.getMyBookId().get(i))
                    .bookName(dto.getMyBookName().get(i))
                    .userId(senderId)
                    .build());
        }

        for (int i = 0; i < dto.getOtherBookId().size(); i++) {
            books.add(ChatRoomBook.builder()
                    .bookId(dto.getOtherBookId().get(i))
                    .bookName(dto.getOtherBookName().get(i))
                    .userId(receiverId)
                    .build());
        }

        // 🆕 3. 채팅방 생성 및 저장
        ChatRoom chatRoom = ChatRoom.builder()
                .userAId(senderId)
                .userBId(receiverId)
                .matching(Matching.builder().matchId(matchId).build())
                .books(books)
                .build();
        chatRoom = chatRoomRepository.save(chatRoom);

        // 📝 4. 안내 메시지 저장
        LocalDateTime now = LocalDateTime.now();
        String systemMessage = "채팅방이 생성되었습니다.";

        ChatMessage noticeMessage = ChatMessage.builder()
                .chatRoom(chatRoom)
                .senderId(senderId)
                .content(systemMessage)
                .type("notice")
                .timestamp(now)
                .build();

        chatMessageRepository.save(noticeMessage);
        chatRoom.updateLastMessage(systemMessage, now);

        return chatRoom;
    }

    /**
     * 💬 [단순 채팅방 생성]
     *
     * 📌 두 사용자 간 책 정보 없이 단순히 채팅을 시작하고자 할 때 사용됩니다.
     *
     * ✅ 기능 요약:
     * - sender와 receiver 간 채팅방이 존재하지 않는다는 전제 하에 호출됩니다.
     * - 새로운 ChatRoom을 생성하고, 시스템 메시지("채팅방이 생성되었습니다.")를 자동 추가합니다.
     * - Matching 없이도 채팅방 생성이 가능합니다 (즉, Matching 엔티티와 무관).
     *
     * @param senderId 채팅을 시작하는 사용자 ID
     * @param receiverId 채팅을 받을 사용자 ID
     * @return 생성된 ChatRoom 엔티티
     */
    @Transactional
    public ChatRoom createChatRoomFromSimple(Long senderId, Long receiverId) {
        // 🆕 1. 채팅방 생성
        ChatRoom chatRoom = ChatRoom.builder()
                .userAId(senderId)
                .userBId(receiverId)
                .build();

        chatRoom = chatRoomRepository.save(chatRoom);

        // 📝 2. 시스템 메시지 저장
        LocalDateTime now = LocalDateTime.now();
        String systemMessage = "채팅방이 생성되었습니다.";

        ChatMessage noticeMessage = ChatMessage.builder()
                .chatRoom(chatRoom)
                .senderId(senderId) // 최초 요청자 기준
                .content(systemMessage)
                .type("notice")
                .timestamp(now)
                .build();

        chatMessageRepository.save(noticeMessage);

        // 💬 3. 채팅방에 마지막 메시지 정보 업데이트
        chatRoom.updateLastMessage(systemMessage, now);

        return chatRoom;
    }



    public Optional<ChatRoom> findByMatchId(Long matchId) {
        return chatRoomRepository.findByMatching_MatchId(matchId);
    }

    /**
     * 🧑‍🤝‍🧑 채팅방 ID로 참여자들의 사용자 ID를 조회합니다.
     *
     * - senderId를 알고 있는 상태에서 상대방(receiverId)을 알기 위한 메서드입니다.
     * - 채팅방에 참여한 두 사람의 userId(userAId, userBId)를 반환합니다.
     *
     * @param chatRoomId 채팅방 ID
     * @return (userAId, userBId) 형태의 Pair 객체
     * @throws IllegalArgumentException 채팅방이 존재하지 않을 경우 예외 발생
     */
    public ChatRoomUserIds getUserIdsByChatRoomId(Long chatRoomId) {
        return chatRoomRepository.findUserIdsByChatRoomId(chatRoomId)
                .orElseThrow(() -> new ChatException(ChatErrorCode.CHATROOM_NOT_FOUND));
    }

    /**
     * 📦 Kafka 이벤트 기반으로 채팅방 정보를 조회하여 ChatRoomDto로 변환합니다.
     *
     * 💬 사용 목적:
     * - KafkaConsumer에서 채팅 목록 WebSocket 갱신을 위해 사용
     *
     * 🧩 처리 과정:
     * 1. 채팅방 ID로 ChatRoom 엔티티 조회
     * 2. senderId를 기준으로 상대방 ID 결정
     * 3. 상대방의 프로필 정보 조회
     * 4. 안 읽은 메시지 수 계산
     * 5. ChatRoomDto 생성
     *
     * @param dto Kafka에서 전달받은 채팅 메시지 DTO
     * @return ChatRoomDto (채팅방 요약 정보)
     */
    public ChatRoomDto getChatRoomDtoByKafkaEvent(ChatMessageKafkaDto dto) {
        Long chatRoomId = dto.getChatRoomId();
        Long senderId = dto.getSenderId();

        // 1. 채팅방 조회
        ChatRoom room = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new ChatException(ChatErrorCode.CHATROOM_NOT_FOUND));

        // 2. 상대방 ID 결정
        Long partnerId = room.getUserAId().equals(senderId) ? room.getUserBId() : room.getUserAId();

        // 3. 상대방 사용자 정보 조회
        Users partner = userService.getUserById(partnerId);

        // 4. 안 읽은 메시지 수 계산
        int unreadCount = chatMessageRepository.countUnreadMessages(chatRoomId, senderId);

        // 5. ChatRoomDto 생성 및 반환
        return ChatRoomDto.from(
                room,
                senderId, // 내 userId
                partnerId,
                partner.getNickname(),
                partner.getProfileImageUrl(),
                partner.getTemperature(), // bookshyScore
                unreadCount
        );
    }

    /**
     * 📚 현재 로그인 사용자가 대여 중인 도서들을 모두 조회합니다.
     *
     * ✅ 조건:
     * - rentalStartDate ≤ 오늘 ≤ rentalEndDate
     * - ExchangeRequest 타입이 RENTAL
     * - 현재 사용자가 해당 거래에 참여한 경우만 포함
     */
    public List<BookResponseDto> getRentalBooksInUse(Long userId) {
        List<BookResponseDto> results = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // 1. 사용자 참여 채팅방 ID 목록 조회
        List<ChatRoom> rooms = chatRoomRepository.findByUserId(userId);

        for (ChatRoom room : rooms) {
            Optional<ChatCalendar> optionalCalendar = chatCalendarRepository.findByChatRoomId(room.getId());

            if (optionalCalendar.isEmpty()) continue;
            ChatCalendar calendar = optionalCalendar.get();

            // 2. 대여 기간 내인지 확인
            if (calendar.getRentalStartDate() == null || calendar.getRentalEndDate() == null) continue;
            LocalDate start = calendar.getRentalStartDate().toLocalDate();
            LocalDate end = calendar.getRentalEndDate().toLocalDate();

            if (today.isBefore(start) || today.isAfter(end)) continue;

            // 3. 연결된 거래 요청 확인
            Long requestId = calendar.getRequestId();
            ExchangeRequest request = exchangeRequestRepository.findById(requestId)
                    .orElseThrow(() -> new ChatException(ChatErrorCode.EXCHANGE_REQUEST_NOT_FOUND));
            if (request == null || !request.getType().name().equals("RENTAL")) continue;

            // 4. 현재 사용자가 요청자인 경우 → 상대방 도서 = bookB
            //    응답자인 경우 → 상대방 도서 = bookA
            Long bookId = null;
            if (request.getRequesterId().equals(userId)) {
                bookId = request.getBookBId();
            } else if (request.getResponderId().equals(userId)) {
                bookId = request.getBookAId();
            } else {
                continue; // 해당 거래의 참여자가 아님
            }

            Book book = bookRepository.findById(bookId)
                    .orElseThrow(() -> new ChatException(ChatErrorCode.BOOK_NOT_FOUND));
            if (book != null) {
                results.add(BookResponseDto.from(book, false));
            }
        }

        return results;
    }

    public ChatOpponentResponseDto getOpponentInfo(Long chatRoomId, Long myUserId) {
        ChatRoomUserIds ids = getUserIdsByChatRoomId(chatRoomId);
        Long opponentId = ids.getUserAId().equals(myUserId) ? ids.getUserBId() : ids.getUserAId();

        Users opponent = userRepository.findById(opponentId)
                .orElseThrow(() -> new UserException(UserErrorCode.USER_NOT_FOUND));

        return ChatOpponentResponseDto.builder()
                .userId(opponent.getUserId())
                .nickname(opponent.getNickname())
                .profileImageUrl(opponent.getProfileImageUrl())
                .temperature(opponent.getTemperature())
                .build();
    }
}
