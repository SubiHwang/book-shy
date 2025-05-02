package com.ssafy.bookshy.domain.chat.service;

import com.ssafy.bookshy.domain.chat.dto.ChatRoomDto;
import com.ssafy.bookshy.domain.chat.dto.CreateChatRoomRequestDto;
import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.chat.repository.ChatRoomRepository;
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
    private final UserService userService;

    public List<ChatRoomDto> getChatRooms(Long userId) {
        List<ChatRoom> rooms = chatRoomRepository.findByUserId(userId);
        return rooms.stream()
                .map(room -> {
                    Long partnerId = room.getUserAId().equals(userId) ? room.getUserBId() : room.getUserAId();
                    String partnerName = userService.getNicknameById(partnerId);
                    String partnerProfileImage = userService.getProfileImageUrlById(partnerId);
                    return ChatRoomDto.from(room, userId, partnerId, partnerName, partnerProfileImage);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public ChatRoomDto createChatRoom(CreateChatRoomRequestDto request) {
        Optional<ChatRoom> existing = chatRoomRepository.findByParticipants(request.getUserAId(), request.getUserBId());
        if (existing.isPresent()) {
            ChatRoom room = existing.get();
            String partnerName = userService.getNicknameById(request.getUserBId());
            String partnerProfile = userService.getProfileImageUrlById(request.getUserBId());
            return ChatRoomDto.from(room, request.getUserAId(), request.getUserBId(), partnerName, partnerProfile);
        }

        ChatRoom newRoom = new ChatRoom(request.getUserAId(), request.getUserBId());
        chatRoomRepository.save(newRoom);

        String partnerName = userService.getNicknameById(request.getUserBId());
        String partnerProfile = userService.getProfileImageUrlById(request.getUserBId());

        return ChatRoomDto.from(newRoom, request.getUserAId(), request.getUserBId(), partnerName, partnerProfile);
    }
}