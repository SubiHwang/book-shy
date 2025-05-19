package com.ssafy.bookshy.domain.users.service;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.exchange.repository.ExchangeRequestRepository;
import com.ssafy.bookshy.domain.library.entity.Library;
import com.ssafy.bookshy.domain.library.repository.LibraryReadLogRepository;
import com.ssafy.bookshy.domain.library.repository.LibraryRepository;
import com.ssafy.bookshy.domain.users.dto.FavoriteCategoryResponseDto;
import com.ssafy.bookshy.domain.users.dto.ReadingLevelResponseDto;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.exception.UserErrorCode;
import com.ssafy.bookshy.domain.users.exception.UserException;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import com.ssafy.bookshy.domain.users.util.CategoryNormalizer;
import com.ssafy.bookshy.domain.users.util.CategoryTitleMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserStatsService {

    private final LibraryRepository libraryRepository;
    private final UserRepository userRepository;
    private final ExchangeRequestRepository exchangeRequestRepository;
    private final LibraryReadLogRepository libraryReadLogRepository;

    public FavoriteCategoryResponseDto getFavoriteCategory(Long userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(UserErrorCode.USER_NOT_FOUND));

        List<Library> libraryList = libraryRepository.findByUser(user);

        Map<String, Integer> countMap = new HashMap<>();

        for (Library library : libraryList) {
            Book book = library.getBook();
            if (book == null || book.getCategory() == null) continue;

            String normalized = CategoryNormalizer.normalize(book.getCategory());
            countMap.put(normalized, countMap.getOrDefault(normalized, 0) + 1);
        }

        if (countMap.isEmpty()) {
            return new FavoriteCategoryResponseDto(null, "선호 카테고리를 분석할 수 없습니다.");
        }

        String favorite = Collections.max(countMap.entrySet(), Map.Entry.comparingByValue()).getKey();
        String title = CategoryTitleMapper.getCategoryTitle(favorite);
        return new FavoriteCategoryResponseDto(favorite, title);
    }

    public ReadingLevelResponseDto getReadingLevel(Long userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(UserErrorCode.USER_NOT_FOUND));

        int readCount = libraryReadLogRepository.countDistinctBooksByUserId(userId);

        double heightCm = readCount * 2.5;
        String height = String.format("약 %.1fcm", heightCm);
        String stageMessage = resolveStageMessage(readCount);

        return new ReadingLevelResponseDto(readCount, height, stageMessage);
    }

    private String resolveStageMessage(int count) {
        if (count >= 200) return "📚 독서의 신! 건물 2층 높이만큼 책을 정복했어요! (약 5m)";
        if (count >= 150) return "📚 독서 마스터! 가로등 높이만큼 책을 읽었어요! (약 3.75m)";
        if (count >= 100) return "🏢 축하합니다! 건물 1층 높이만큼 독서를 달성했어요! (약 2.5m)";
        if (count >= 90)  return "🏓 독서 마라토너! 탁구대 길이만큼 책을 쌓았어요! (약 2.25m)";
        if (count >= 80)  return "🚪 놀라워요! 일반 문 높이만큼 책을 읽으셨어요! (약 2m)";
        if (count >= 70)  return "📦 독서 고수의 길! 냉장고의 거의 전체 높이만큼 읽었어요! (약 1.75m)";
        if (count >= 60)  return "📏 꾸준한 독서가 습관이 되고 있어요! 성인 어깨 높이만큼 읽었어요! (약 1.5m)";
        if (count >= 50)  return "🧺 독서의 중간 지점! 세탁기 높이만큼 읽었어요! (약 1.25m)";
        if (count >= 40)  return "🤓 지식이 늘고 있어요! 성인 허리 높이만큼 책을 읽었어요! (약 1m)";
        if (count >= 30)  return "🍽️ 열정적인 독서가! 식탁 높이까지 쌓았어요! (약 75cm)";
        if (count >= 20)  return "🪑 대단해요! 의자 높이만큼 책을 읽으셨어요! (약 50cm)";
        if (count >= 15)  return "🐶 꾸준히 읽고 계시네요! 작은 강아지 높이만큼 읽었어요! (약 37.5cm)";
        if (count >= 10)  return "🧳 잘 하고 계세요! 작은 캐리어 높이만큼 쌓였어요! (약 25cm)";
        if (count >= 5)   return "🍷 축하합니다! 와인병 높이만큼 책을 읽으셨네요! (약 12.5cm)";
        return "📖 이제 막 시작했어요! 오늘 한 장부터 열어볼까요?";
    }
}
