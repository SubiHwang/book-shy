package com.ssafy.bookshy.domain.matching.service;

import com.ssafy.bookshy.domain.chat.entity.ChatRoom;
import com.ssafy.bookshy.domain.chat.repository.ChatRoomRepository;
import com.ssafy.bookshy.domain.library.entity.Library;
import com.ssafy.bookshy.domain.library.repository.LibraryRepository;
import com.ssafy.bookshy.domain.matching.dto.MatchChatRequestDto;
import com.ssafy.bookshy.domain.matching.dto.MatchResponseDto;
import com.ssafy.bookshy.domain.matching.dto.MatchingDto;
import com.ssafy.bookshy.domain.matching.dto.MatchingPageResponseDto;
import com.ssafy.bookshy.domain.matching.entity.Matching;
import com.ssafy.bookshy.domain.matching.event.MatchCreatedEvent;
import com.ssafy.bookshy.domain.matching.repository.MatchingRepository;
import com.ssafy.bookshy.domain.matching.util.MatchingScoreCalculator;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import com.ssafy.bookshy.kafka.producer.KafkaProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final LibraryRepository libraryRepository;
    private final UserRepository userRepository;
    private final MatchingRepository matchingRepository;
    private final KafkaProducer kafkaProducer;
    private final ChatRoomRepository chatRoomRepository;
    private final ApplicationEventPublisher applicationEventPublisher;

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
                        .score(score)
                        .build();

                result.add(dto);
            }
        }

        return result.stream()
                .sorted(Comparator.comparingDouble(MatchingDto::getScore).reversed())
                .toList();
    }

    // 점수 순 + 거리 순 정렬 후 목록 반환
    public List<MatchingDto> findCandidates(Long myUserId) {
        List<MatchingDto> all = findMatchingCandidates(myUserId);

        return all.stream()
                .sorted(Comparator.comparingDouble(MatchingDto::getScore).reversed())
                .toList();
    }

    @Transactional
    public MatchResponseDto chatMatching(Long senderId, MatchChatRequestDto dto) {
        Matching match = Matching.builder()
                .senderId(senderId)
                .receiverId(dto.getReceiverId())
                .matchedAt(LocalDateTime.now())
                .status(Matching.Status.ACCEPTED)
                .build();

        matchingRepository.save(match);

        applicationEventPublisher.publishEvent(new MatchCreatedEvent(match));

        Long chatRoomId = waitForChatRoomCreation(match.getMatchId());

        return MatchResponseDto.builder()
                .matchId(match.getMatchId())
                .chatRoomId(chatRoomId)
                .build();
    }

    public MatchingPageResponseDto findPagedCandidates(Long myUserId, int page, int size) {
        List<MatchingDto> all = findMatchingCandidates(myUserId);
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

    private Long waitForChatRoomCreation(Long matchId) {
        int retries = 20;
        int delayMillis = 500;

        for (int i = 0; i < retries; i++) {
            Optional<ChatRoom> roomOpt = chatRoomRepository.findByMatching_MatchId(matchId);
            if (roomOpt.isPresent()) {
                return roomOpt.get().getId();
            }
            try {
                Thread.sleep(delayMillis);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        throw new IllegalStateException("채팅방 생성이 지연되고 있습니다.");
    }
}
