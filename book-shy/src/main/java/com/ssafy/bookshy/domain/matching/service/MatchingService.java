package com.ssafy.bookshy.domain.matching.service;

import com.ssafy.bookshy.domain.book.repository.WishRepository;
import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.chat.repository.ChatRoomRepository;
import com.ssafy.bookshy.domain.library.entity.Library;
import com.ssafy.bookshy.domain.library.repository.LibraryRepository;
import com.ssafy.bookshy.domain.matching.dto.*;
import com.ssafy.bookshy.domain.matching.entity.Matching;
import com.ssafy.bookshy.domain.matching.event.MatchCreatedEvent;
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

    public List<MatchingDto> findMatchingCandidates(Long myUserId) {
        // 🔹 1. 내 정보 가져오기
        Users me = userRepository.findById(myUserId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 🔹 2. 내가 원하는 책을 가진 상대방 후보들 찾기
        List<Users> candidates = libraryRepository.findCandidatesByMyWishBooks(myUserId);

        List<MatchingDto> result = new ArrayList<>();

        for (Users other : candidates) {
            Long otherUserId = other.getUserId();

            // 🔹 3. 내가 원하는 책을 그 사람이 공개 서재에 가지고 있는지
            List<Library> theirBooksIMightWant =
                    libraryRepository.findTheirLibrariesMatchingMyWishes(myUserId, otherUserId);

            // 🔹 4. 그 사람이 원하는 책을 내가 공개 서재에 가지고 있는지
            List<Library> myBooksTheyMightWant =
                    libraryRepository.findMyLibrariesMatchingTheirWishes(myUserId, otherUserId);

            // 🔹 5. 서로 조건이 맞는다면 매칭 후보 생성
            if (!theirBooksIMightWant.isEmpty() && !myBooksTheyMightWant.isEmpty()) {

                List<Long> myBookIds = new ArrayList<>();
                List<String> myBookNames = new ArrayList<>();
                for (Library l : myBooksTheyMightWant) {
                    myBookIds.add(l.getBook().getId());
                    myBookNames.add(l.getBook().getTitle());
                }

                List<Long> otherBookIds = new ArrayList<>();
                List<String> otherBookNames = new ArrayList<>();
                for (Library l : theirBooksIMightWant) {
                    otherBookIds.add(l.getBook().getId());
                    otherBookNames.add(l.getBook().getTitle());
                }

                double score = MatchingScoreCalculator.totalScore(me, other);

                double distKm = MatchingScoreCalculator.calculateDistance(
                        me.getLatitude(), me.getLongitude(),
                        other.getLatitude(), other.getLongitude()
                );

                if (distKm > 20.0) {
                    continue;
                }

                MatchingDto dto = MatchingDto.builder()
                        .userId(other.getUserId())
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

        // 🔍 기존 Matching 존재 여부 확인 (양방향 체크 필요)
        Optional<Matching> existingMatchOpt = matchingRepository
                .findByUsers(senderId, receiverId);

        if (existingMatchOpt.isPresent()) {
            Matching existingMatch = existingMatchOpt.get();

            // 🔍 해당 매칭에 대한 채팅방이 이미 있는지 확인
            Optional<ChatRoom> existingChatRoomOpt = chatRoomRepository
                    .findByMatching(existingMatch);

            if (existingChatRoomOpt.isPresent()) {
                return MatchResponseDto.builder()
                        .matchId(existingMatch.getMatchId())
                        .chatRoomId(existingChatRoomOpt.get().getId())
                        .build();
            }

            // 채팅방만 없는 경우 → 채팅방 생성
            ChatRoom chatRoom = chatRoomRepository.save(
                    ChatRoom.builder()
                            .matching(existingMatch)
                            .userAId(existingMatch.getSenderId())
                            .userBId(existingMatch.getReceiverId())
                            .build()
            );

            return MatchResponseDto.builder()
                    .matchId(existingMatch.getMatchId())
                    .chatRoomId(chatRoom.getId())
                    .build();
        }

        // ❌ 매칭 자체가 없다면 새로 생성
        Matching match = matchingRepository.save(
                Matching.builder()
                        .senderId(senderId)
                        .receiverId(receiverId)
                        .matchedAt(LocalDateTime.now())
                        .status(Matching.Status.ACCEPTED)
                        .build()
        );

        ChatRoom chatRoom = chatRoomRepository.save(
                ChatRoom.builder()
                        .matching(match)
                        .userAId(match.getSenderId())
                        .userBId(match.getReceiverId())
                        .build()
        );

        applicationEventPublisher.publishEvent(new MatchCreatedEvent(match));

        // 👤 상대방 정보 조회
        Users partner = userService.getUserById(receiverId);

        // ✅ MatchResponseDto 반환
        return MatchResponseDto.builder()
                .matchId(match.getMatchId())
                .chatRoomId(chatRoom.getId())
                .nickname(partner.getNickname())
                .profileImageUrl(partner.getProfileImageUrl())
                .temperature(partner.getTemperature())
                .build();
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
                .map(u -> {
                    double distance = MatchingScoreCalculator.calculateDistance(
                            me.getLatitude(), me.getLongitude(),
                            u.getLatitude(), u.getLongitude()
                    );
                    return new AbstractMap.SimpleEntry<Users, Double>(u, distance);
                })
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
                .map(lib -> {
                    boolean isLiked = wishedBookIds.contains(lib.getBook().getId());
                    return NeighborLibraryResponseDto.BookWithLikeDto.from(lib, isLiked);
                })
                .toList();

        return NeighborLibraryResponseDto.builder()
                .userId(targetUser.getUserId())
                .nickname(targetUser.getNickname())
                .books(books)
                .build();
    }
}
