package com.ssafy.bookshy.domain.chat.service;

import com.ssafy.bookshy.domain.chat.dto.ChatRoomDto;
import com.ssafy.bookshy.domain.chat.dto.CreateChatRoomRequestDto;
import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.chat.repository.ChatMessageRepository;
import com.ssafy.bookshy.domain.chat.repository.ChatRoomRepository;
import com.ssafy.bookshy.domain.matching.repository.MatchingRepository;
import com.ssafy.bookshy.domain.users.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final MatchingRepository matchingRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<ChatRoomDto> getChatRooms(Long userId) {
        List<ChatRoom> rooms = chatRoomRepository.findByUserId(userId);

        return rooms.stream()
                .map(room -> {
                    Long partnerId = room.getUserAId().equals(userId) ? room.getUserBId() : room.getUserAId();
                    String partnerName = userService.getNicknameById(partnerId);
                    String partnerProfileImage = userService.getProfileImageUrlById(partnerId);

                    // ✅ 1. 안 읽은 메시지 수
                    int unreadCount = chatMessageRepository.countUnreadMessages(room.getId(), userId);

                    // ✅ 2. DTO 생성
                    return ChatRoomDto.from(
                            room,
                            userId,
                            partnerId,
                            partnerName,
                            partnerProfileImage,
                            unreadCount
                    );
                })
                .collect(Collectors.toList());
    }


    @Transactional
    public ChatRoom createChatRoomFromMatch(Long userAId, Long userBId) {
        // 기존에 존재하는 방이 있다면 반환
        Optional<ChatRoom> existing = chatRoomRepository.findByParticipants(userAId, userBId);
        if (existing.isPresent()) {
            return existing.get();
        }

        // 새 채팅방 생성
        ChatRoom chatRoom = new ChatRoom(userAId, userBId);
        return chatRoomRepository.save(chatRoom);
    }
}