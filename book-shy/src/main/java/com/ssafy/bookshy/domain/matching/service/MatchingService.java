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

    /**
     * 🔍 [매칭 후보 조회]
     *
     * 📌 내가 찜한 책을 보유한 사용자들을 대상으로,
     *     해당 사용자가 나의 찜 책을 공개서재에 보유하고 있는지,
     *     그리고 나도 그 사용자의 찜 책을 보유하고 있는지를 확인합니다.
     *
     * 📦 조건을 만족할 경우 MatchingDto로 구성된 후보 리스트를 반환합니다.
     * 거리 제한 20km 이하만 포함됩니다.
     *
     * @param myUserId 현재 로그인한 사용자 ID
     * @return 매칭 후보 리스트
     */
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

    /**
     * 🤝 [채팅 매칭 요청]
     *
     * 📌 요청자(senderId)와 상대방(receiverId) 간의 매칭을 생성하거나,
     *     기존 매칭이 있다면 재사용합니다.
     *
     * 💬 이후 채팅방이 없다면 새로 생성하며, 채팅방이 새로 만들어질 경우
     *     notice 메시지를 추가하고, 요청자/상대방의 책 정보도 함께 저장합니다.
     *
     * 🔔 최초 매칭일 경우 Kafka 이벤트(`MatchCreatedEvent`)도 발행합니다.
     *
     * @param senderId 현재 로그인 사용자 ID
     * @param dto 요청자 및 상대방의 책 정보 포함
     * @return MatchResponseDto (채팅방 ID, 상대방 닉네임/이미지/온도/책 정보 포함)
     */
    @Transactional
    public MatchResponseDto chatMatching(Long senderId, MatchChatRequestDto dto) {
        Long receiverId = dto.getReceiverId();

        // 👤 상대방 정보 조회
        Users partner = userService.getUserById(receiverId);

        // 🔍 기존 매칭 존재 여부 확인
        Optional<Matching> existingMatchOpt = matchingRepository.findByUsers(senderId, receiverId);

        if (existingMatchOpt.isPresent()) {
            Matching existingMatch = existingMatchOpt.get();

            // 🔍 기존 채팅방 존재 여부 확인
            Optional<ChatRoom> existingChatRoomOpt = chatRoomRepository.findByMatching(existingMatch);
            if (existingChatRoomOpt.isPresent()) {
                // ✅ 기존 채팅방이 있는 경우 그대로 응답
                return MatchResponseDto.builder()
                        .matchId(existingMatch.getMatchId())
                        .chatRoomId(existingChatRoomOpt.get().getId())
                        .nickname(partner.getNickname())
                        .profileImageUrl(partner.getProfileImageUrl())
                        .temperature(partner.getTemperature())
                        .myBookId(dto.getMyBookId())
                        .myBookName(dto.getMyBookName())
                        .otherBookId(dto.getOtherBookId())
                        .otherBookName(dto.getOtherBookName())
                        .build();
            }

            // 🔧 채팅방은 없을 경우 새로 생성
            ChatRoom chatRoom = chatRoomService.createChatRoomFromMatch(existingMatch.getMatchId(), dto);

            return MatchResponseDto.builder()
                    .matchId(existingMatch.getMatchId())
                    .chatRoomId(chatRoom.getId())
                    .nickname(partner.getNickname())
                    .profileImageUrl(partner.getProfileImageUrl())
                    .temperature(partner.getTemperature())
                    .myBookId(dto.getMyBookId())
                    .myBookName(dto.getMyBookName())
                    .otherBookId(dto.getOtherBookId())
                    .otherBookName(dto.getOtherBookName())
                    .build();
        }

        // ❌ 매칭이 없을 경우 새로 생성
        Matching match = matchingRepository.save(
                Matching.builder()
                        .senderId(senderId)
                        .receiverId(receiverId)
                        .matchedAt(LocalDateTime.now())
                        .status(Matching.Status.ACCEPTED)
                        .build()
        );

        // 💬 채팅방 생성 (책 정보 포함)
        dto.setSenderId(senderId); // 명시적 설정 (안 되어 있으면 방어용)
        ChatRoom chatRoom = chatRoomService.createChatRoomFromMatch(match.getMatchId(), dto);

        // 🔔 Kafka 이벤트 발행
        applicationEventPublisher.publishEvent(new MatchCreatedEvent(match));

        return MatchResponseDto.builder()
                .matchId(match.getMatchId())
                .chatRoomId(chatRoom.getId())
                .nickname(partner.getNickname())
                .profileImageUrl(partner.getProfileImageUrl())
                .temperature(partner.getTemperature())
                .myBookId(dto.getMyBookId())
                .myBookName(dto.getMyBookName())
                .otherBookId(dto.getOtherBookId())
                .otherBookName(dto.getOtherBookName())
                .build();
    }

    /**
     * 💬 [단순 채팅방 생성 요청]
     *
     * 📌 로그인한 사용자와 상대방 간에 **단순 채팅방**을 생성하거나,
     *     이미 존재하는 경우 해당 채팅방을 반환합니다.
     *
     * - 도서 매칭 정보 없이 자유롭게 대화를 시작하고 싶은 경우에 사용됩니다.
     * - 동일 사용자 조합에 대해 중복 채팅방 생성을 방지합니다.
     * - 새 채팅방이 생성되면 `"채팅방이 생성되었습니다."`라는 시스템 메시지가 자동 추가됩니다.
     *
     * @param senderId 현재 로그인한 사용자 ID
     * @param receiverId 채팅을 시작할 상대방 사용자 ID
     * @return SimpleChatResponseDto (채팅방 ID, 상대방 프로필 정보 등 포함)
     */
    @Transactional
    public SimpleChatResponseDto createSimpleChatRoom(Long senderId, Long receiverId) {
        // 👤 상대방 정보 조회
        Users partner = userService.getUserById(receiverId);

        // 🔄 기존 채팅방 존재 여부 확인
        Optional<ChatRoom> existing = chatRoomRepository.findByParticipants(senderId, receiverId);
        if (existing.isPresent()) {
            ChatRoom chatRoom = existing.get();
            return SimpleChatResponseDto.builder()
                    .chatRoomId(chatRoom.getId())
                    .nickname(partner.getNickname())
                    .profileImageUrl(partner.getProfileImageUrl())
                    .temperature(partner.getTemperature())
                    .build();
        }

        // 🆕 새로운 채팅방 생성 (책 정보 없이)
        ChatRoom chatRoom = chatRoomService.createChatRoomFromSimple(senderId, receiverId);

        return SimpleChatResponseDto.builder()
                .chatRoomId(chatRoom.getId())
                .nickname(partner.getNickname())
                .profileImageUrl(partner.getProfileImageUrl())
                .temperature(partner.getTemperature())
                .build();
    }


    /**
     * 📖 [매칭 후보 페이징 조회]
     *
     * 📌 `findMatchingCandidates()` 결과를 페이징 정렬하여 반환합니다.
     * 정렬 기준은 점수(score) 또는 거리(distance)로 선택 가능하며,
     * 기본은 점수 내림차순입니다.
     *
     * @param myUserId 현재 사용자 ID
     * @param page 페이지 번호 (1부터 시작)
     * @param size 페이지 당 결과 수
     * @param sort 정렬 기준 ("score" 또는 "distance")
     * @return MatchingPageResponseDto (후보 리스트 + 페이지 메타 정보)
     */
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

    /**
     * 🗺️ [내 주변 유저 조회]
     *
     * 📌 20km 이내에 위치한 사용자를 기준으로,
     *     거리순으로 최대 10명을 반환합니다.
     *
     * 📍 사용자의 위도/경도가 등록되어 있어야 필터링 대상이 됩니다.
     *
     * @param me 현재 로그인한 사용자
     * @return 주변 사용자 정보 리스트 (닉네임, 거리 등 포함)
     */
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

    /**
     * 📚 [이웃의 서재 열람]
     *
     * 📌 특정 사용자의 공개서재를 조회하며,
     *     현재 로그인한 사용자가 해당 책을 찜했는지도 함께 표시됩니다.
     *
     * @param targetUserId 조회 대상 사용자 ID
     * @param viewerUserId 열람자 사용자 ID
     * @return NeighborLibraryResponseDto (책 정보 + 찜 여부 포함)
     */
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
