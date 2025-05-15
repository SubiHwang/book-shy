package com.ssafy.bookshy.domain.chat.service;

import com.ssafy.bookshy.domain.chat.dto.ChatRoomDto;
import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.chat.repository.ChatMessageRepository;
import com.ssafy.bookshy.domain.chat.repository.ChatRoomRepository;
import com.ssafy.bookshy.domain.matching.entity.Matching;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
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
     * - 이미 존재하는 채팅방이 있다면 해당 채팅방 반환
     * - 없다면 새로 생성하여 저장 후 반환
     *
     * @param userAId 사용자 A
     * @param userBId 사용자 B
     * @return 생성되거나 기존의 채팅방
     */
    @Transactional
    public ChatRoom createChatRoomFromMatch(Long userAId, Long userBId, Long matchId) {
        // 🔄 1. 이미 존재하는 채팅방이 있는지 확인
        Optional<ChatRoom> existing = chatRoomRepository.findByParticipants(userAId, userBId);
        if (existing.isPresent()) {
            return existing.get();
        }

        // 🆕 2. 새로운 채팅방 생성 및 저장
        ChatRoom chatRoom = ChatRoom.builder()
                .userAId(userAId)
                .userBId(userBId)
                .matching(Matching.builder().matchId(matchId).build())
                .build();
        return chatRoomRepository.save(chatRoom);
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
    public Pair<Long, Long> getUserIdsByChatRoomId(Long chatRoomId) {
        Object[] result = chatRoomRepository.findUserIdsByChatRoomId(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("채팅방이 존재하지 않습니다."));

        Long userAId = convertToLong(result[0]);
        Long userBId = convertToLong(result[1]);

        return Pair.of(userAId, userBId);
    }

    private Long convertToLong(Object value) {
        if (value instanceof Long) return (Long) value;
        if (value instanceof Integer) return ((Integer) value).longValue();
        if (value instanceof Short) return ((Short) value).longValue();
        if (value instanceof BigInteger) return ((BigInteger) value).longValue();
        throw new IllegalArgumentException("지원되지 않는 ID 타입: " + value.getClass());
    }
}
