package com.ssafy.bookshy.domain.users.service;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.library.entity.Library;
import com.ssafy.bookshy.domain.library.repository.LibraryRepository;
import com.ssafy.bookshy.domain.users.dto.FavoriteCategoryResponseDto;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.exception.UserErrorCode;
import com.ssafy.bookshy.domain.users.exception.UserException;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import com.ssafy.bookshy.domain.users.util.CategoryNormalizer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserStatsService {

    private final LibraryRepository libraryRepository;
    private final UserRepository userRepository;

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

        return new FavoriteCategoryResponseDto(favorite, favorite + " 도서 마니아입니다!");
    }
}
