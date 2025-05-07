package com.ssafy.bookshy.domain.booknote.service;

import com.ssafy.bookshy.domain.booknote.dto.BookNoteRequest;
import com.ssafy.bookshy.domain.booknote.dto.BookQuoteRequest;
import com.ssafy.bookshy.domain.booknote.entity.BookNote;
import com.ssafy.bookshy.domain.booknote.entity.BookQuote;
import com.ssafy.bookshy.domain.booknote.repository.BookNoteRepository;
import com.ssafy.bookshy.domain.booknote.repository.BookQuoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookQuoteService {

    private final BookQuoteRepository bookQuoteRepository;

    @Transactional
    public BookQuote create(BookQuoteRequest request) {
        BookQuote quote = BookQuote.builder()
                .userId(request.getUserId())
                .bookId(request.getBookId())
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .build();
        return bookQuoteRepository.save(quote);
    }

    @Transactional
    public BookQuote update(Long quoteId, BookQuoteRequest request) {
        BookQuote quote = bookQuoteRepository.findById(quoteId)
                .orElseThrow(() -> new IllegalArgumentException("해당 인용구가 존재하지 않습니다."));
        quote.setContent(request.getContent());
        return quote;
    }

    // 💬 BookQuoteService.java - 인용구 목록 조회 서비스 추가
    /**
     * 💬 사용자 ID와 (선택적으로) 도서 ID를 기반으로 인용구 목록을 조회합니다.
     * - 도서 ID가 없으면 전체 인용구를,
     * - 있으면 해당 도서의 인용구만 필터링합니다.
     */
    @Transactional(readOnly = true)
    public List<BookQuote> findByUserId(Long userId, Long bookId) {
        return bookQuoteRepository.findAll().stream()
                .filter(q -> q.getUserId().equals(userId))
                .filter(q -> bookId == null || q.getBookId().equals(bookId))
                .toList();
    }
}