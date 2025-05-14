package com.ssafy.bookshy.domain.matching.service;

import com.ssafy.bookshy.domain.library.entity.Library;
import com.ssafy.bookshy.domain.library.repository.LibraryRepository;
import com.ssafy.bookshy.domain.matching.dto.MatchConfirmRequestDto;
import com.ssafy.bookshy.domain.matching.dto.MatchingDto;
import com.ssafy.bookshy.domain.matching.entity.Matching;
import com.ssafy.bookshy.domain.matching.repository.MatchingRepository;
import com.ssafy.bookshy.domain.matching.util.MatchingScoreCalculator;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import com.ssafy.bookshy.kafka.dto.MatchSuccessDto;
import com.ssafy.bookshy.kafka.producer.KafkaProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final LibraryRepository libraryRepository;
    private final UserRepository userRepository;
    private final MatchingRepository matchingRepository;
    private final KafkaProducer kafkaProducer;

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
                Library myBook = myBooksTheyMightWant.get(0);
                Library theirBook = theirBooksIMightWant.get(0);

                // 🔹 6. 점수 계산
                double score = MatchingScoreCalculator.totalScore(me, other);

                // 🔹 7. DTO 생성
                MatchingDto dto = MatchingDto.builder()
                        .bookAId(myBook.getBook().getId())          // 내가 줄 책
                        .bookBId(theirBook.getBook().getId())       // 내가 받을 책
                        .status("PENDING")
                        .matchedAt(LocalDateTime.now())
                        .score(score)
                        .build();

                result.add(dto);
            }
        }

        // 🔹 8. 점수 높은 순으로 정렬해서 반환
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
    public Long confirmMatching(Long senderId, MatchConfirmRequestDto dto) {
        Matching match = Matching.builder()
                .bookAId(dto.getBookAId())
                .bookBId(dto.getBookBId())
                .senderId(senderId)
                .receiverId(dto.getReceiverId())
                .matchedAt(LocalDateTime.now())
                .status(Matching.Status.ACCEPTED)
                .build();

        matchingRepository.save(match);

        MatchSuccessDto event = MatchSuccessDto.builder()
                .matchId(match.getMatchId())
                .userAId(senderId)
                .userBId(dto.getReceiverId())
                .bookAId(dto.getBookAId())
                .bookBId(dto.getBookBId())
                .matchedAt(match.getMatchedAt().toString())
                .build();

        kafkaProducer.sendMatchSuccessEvent(event);

        return match.getMatchId();
    }
}
