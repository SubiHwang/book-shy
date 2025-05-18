package com.ssafy.bookshy.domain.matching.service;

import com.ssafy.bookshy.domain.book.repository.WishRepository;
import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.chat.repository.ChatRoomRepository;
import com.ssafy.bookshy.domain.chat.service.ChatRoomService;
import com.ssafy.bookshy.domain.library.entity.Library;
import com.ssafy.bookshy.domain.library.repository.LibraryRepository;
import com.ssafy.bookshy.domain.matching.dto.*;
import com.ssafy.bookshy.domain.matching.entity.Matching;
import com.ssafy.bookshy.domain.matching.event.MatchCreatedEvent;
import com.ssafy.bookshy.domain.matching.exception.MatchingErrorCode;
import com.ssafy.bookshy.domain.matching.exception.MatchingException;
import com.ssafy.bookshy.domain.matching.repository.MatchingRepository;
import com.ssafy.bookshy.domain.matching.util.MatchingScoreCalculator;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import com.ssafy.bookshy.domain.users.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final LibraryRepository libraryRepository;
    private final UserRepository userRepository;
    private final MatchingRepository matchingRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ApplicationEventPublisher applicationEventPublisher;
    private final UserService userService;
    private final WishRepository wishRepository;
    private final ChatRoomService chatRoomService;

    public List<MatchingDto> findMatchingCandidates(Long myUserId) {
        Users me = userRepository.findById(myUserId)
                .orElseThrow(() -> new MatchingException(MatchingErrorCode.USER_NOT_FOUND));

        List<Users> candidates = libraryRepository.findCandidatesByMyWishBooks(myUserId);
        List<MatchingDto> result = new ArrayList<>();

        for (Users other : candidates) {
            Long otherUserId = other.getUserId();

            List<Library> theirBooksIMightWant =
                    libraryRepository.findTheirLibrariesMatchingMyWishes(myUserId, otherUserId);

            List<Library> myBooksTheyMightWant =
                    libraryRepository.findMyLibrariesMatchingTheirWishes(myUserId, otherUserId);

            if (!theirBooksIMightWant.isEmpty() && !myBooksTheyMightWant.isEmpty()) {

                List<Long> myBookIds = myBooksTheyMightWant.stream().map(l -> l.getBook().getId()).toList();
                List<String> myBookNames = myBooksTheyMightWant.stream().map(l -> l.getBook().getTitle()).toList();

                List<Long> otherBookIds = theirBooksIMightWant.stream().map(l -> l.getBook().getId()).toList();
                List<String> otherBookNames = theirBooksIMightWant.stream().map(l -> l.getBook().getTitle()).toList();

                double distKm = MatchingScoreCalculator.calculateDistance(
                        me.getLatitude(), me.getLongitude(),
                        other.getLatitude(), other.getLongitude()
                );

                if (distKm > 20.0) continue;

                MatchingDto dto = MatchingDto.builder()
                        .userId(otherUserId)
                        .nickname(other.getNickname())
                        .address(other.getAddress())
                        .profileImageUrl(other.getProfileImageUrl())
                        .temperature(other.getTemperature() != null ? Math.round(other.getTemperature()) : 36)
                        .myBookId(myBookIds)
                        .myBookName(myBookNames)
                        .otherBookId(otherBookIds)
                        .otherBookName(otherBookNames)
                        .matchedAt(LocalDateTime.now())
                        .score(Math.round(MatchingScoreCalculator.totalScore(me, other) * 10.0) / 10.0)
                        .distanceKm(Math.round(distKm * 100.0) / 100.0)
                        .build();

                result.add(dto);
            }
        }

        return result.stream()
                .sorted(Comparator.comparingDouble(MatchingDto::getScore).reversed())
                .toList();
    }

    @Transactional
    public MatchResponseDto chatMatching(Long senderId, MatchChatRequestDto dto) {
        Long receiverId = dto.getReceiverId();

        if (Objects.equals(senderId, receiverId)) {
            throw new MatchingException(MatchingErrorCode.SAME_USER_MATCH_NOT_ALLOWED);
        }

        Users partner = userService.getUserById(receiverId);

        Optional<Matching> existingMatchOpt = matchingRepository.findByUsers(senderId, receiverId);

        if (existingMatchOpt.isPresent()) {
            Matching existingMatch = existingMatchOpt.get();
            Optional<ChatRoom> existingChatRoomOpt = chatRoomRepository.findByMatching(existingMatch);

            if (existingChatRoomOpt.isPresent()) {
                return buildMatchResponse(existingMatch.getMatchId(), existingChatRoomOpt.get().getId(), partner, dto);
            }

            ChatRoom chatRoom = chatRoomService.createChatRoomFromMatch(existingMatch.getMatchId(), dto);
            return buildMatchResponse(existingMatch.getMatchId(), chatRoom.getId(), partner, dto);
        }

        Matching match = matchingRepository.save(
                Matching.builder()
                        .senderId(senderId)
                        .receiverId(receiverId)
                        .matchedAt(LocalDateTime.now())
                        .status(Matching.Status.ACCEPTED)
                        .build()
        );

        dto.setSenderId(senderId);
        ChatRoom chatRoom = chatRoomService.createChatRoomFromMatch(match.getMatchId(), dto);
        applicationEventPublisher.publishEvent(new MatchCreatedEvent(match));

        return buildMatchResponse(match.getMatchId(), chatRoom.getId(), partner, dto);
    }

    @Transactional
    public SimpleChatResponseDto createSimpleChatRoom(Long senderId, Long receiverId) {
        if (Objects.equals(senderId, receiverId)) {
            throw new MatchingException(MatchingErrorCode.SAME_USER_MATCH_NOT_ALLOWED);
        }

        Users partner = userService.getUserById(receiverId);

        Optional<ChatRoom> existing = chatRoomRepository.findByParticipants(senderId, receiverId);
        if (existing.isPresent()) {
            return buildSimpleResponse(existing.get().getId(), partner);
        }

        ChatRoom chatRoom = chatRoomService.createChatRoomFromSimple(senderId, receiverId);
        return buildSimpleResponse(chatRoom.getId(), partner);
    }

    public MatchingPageResponseDto findPagedCandidates(Long myUserId, int page, int size, String sort) {
        List<MatchingDto> all = findMatchingCandidates(myUserId);

        all = switch (sort.toLowerCase()) {
            case "distance" -> all.stream()
                    .sorted(Comparator.comparingDouble(MatchingDto::getDistanceKm))
                    .toList();
            default -> all.stream()
                    .sorted(Comparator.comparingDouble(MatchingDto::getScore).reversed())
                    .toList();
        };

        int total = all.size();
        int fromIndex = Math.min((page - 1) * size, total);
        int toIndex = Math.min(page * size, total);
        List<MatchingDto> pageResult = all.subList(fromIndex, toIndex);

        return MatchingPageResponseDto.builder()
                .candidates(pageResult)
                .totalPages((int) Math.ceil((double) total / size))
                .currentPage(page)
                .results(total)
                .build();
    }

    public List<NearbyUserResponseDto> findNearbyUsers(Users me) {
        List<Users> others = userRepository.findAllExcept(me.getUserId());

        return others.stream()
                .filter(u -> u.getLatitude() != null && u.getLongitude() != null)
                .map(u -> new AbstractMap.SimpleEntry<>(u,
                        MatchingScoreCalculator.calculateDistance(me.getLatitude(), me.getLongitude(),
                                u.getLatitude(), u.getLongitude())))
                .filter(entry -> entry.getValue() <= 20.0)
                .sorted(Map.Entry.comparingByValue())
                .limit(10)
                .map(entry -> new NearbyUserResponseDto(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    public NeighborLibraryResponseDto getNeighborLibrary(Long targetUserId, Long viewerUserId) {
        Users targetUser = userService.getUserById(targetUserId);
        Users viewer = userService.getUserById(viewerUserId);

        List<Library> publicBooks = libraryRepository.findByUserAndIsPublicTrueOrderByRegisteredAtDesc(targetUser);
        List<Long> wishedBookIds = wishRepository.findBookIdsByUser(viewer);

        List<NeighborLibraryResponseDto.BookWithLikeDto> books = publicBooks.stream()
                .map(lib -> NeighborLibraryResponseDto.BookWithLikeDto.from(lib, wishedBookIds.contains(lib.getBook().getId())))
                .toList();

        return NeighborLibraryResponseDto.builder()
                .userId(targetUser.getUserId())
                .nickname(targetUser.getNickname())
                .books(books)
                .build();
    }

    private MatchResponseDto buildMatchResponse(Long matchId, Long chatRoomId, Users partner, MatchChatRequestDto dto) {
        return MatchResponseDto.builder()
                .matchId(matchId)
                .chatRoomId(chatRoomId)
                .nickname(partner.getNickname())
                .profileImageUrl(partner.getProfileImageUrl())
                .temperature(partner.getTemperature())
                .myBookId(dto.getMyBookId())
                .myBookName(dto.getMyBookName())
                .otherBookId(dto.getOtherBookId())
                .otherBookName(dto.getOtherBookName())
                .build();
    }

    private SimpleChatResponseDto buildSimpleResponse(Long chatRoomId, Users partner) {
        return SimpleChatResponseDto.builder()
                .chatRoomId(chatRoomId)
                .nickname(partner.getNickname())
                .profileImageUrl(partner.getProfileImageUrl())
                .temperature(partner.getTemperature())
                .build();
    }
}
