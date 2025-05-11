package com.ssafy.bookshy.domain.recommend.service;

import com.ssafy.bookshy.domain.book.dto.BookResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class BookRecommendByPopular {
    public List<BookResponseDto> getPopularRecommendations(int recommendCount) {
    }
}
