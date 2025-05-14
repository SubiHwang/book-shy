package com.ssafy.bookshy.domain.booknote.service;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.book.repository.BookRepository;
import com.ssafy.bookshy.domain.booknote.dto.BookNoteRequest;
import com.ssafy.bookshy.domain.booknote.dto.BookQuoteRequest;
import com.ssafy.bookshy.domain.booknote.dto.BookQuoteResponseDto;
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
    private final BookRepository bookRepository;

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

    /**
     * 💬 사용자 ID를 기반으로 인용구 목록을 조회합니다.
     */
    @Transactional(readOnly = true)
    public List<BookQuoteResponseDto> findQuoteResponsesByUserId(Long userId) {
        return bookQuoteRepository.findAll().stream()
                .filter(q -> q.getUserId().equals(userId))
                .map(q -> {
                    Book book = bookRepository.findById(q.getBookId())
                            .orElseThrow(() -> new IllegalArgumentException("도서 정보를 찾을 수 없습니다."));
                    return BookQuoteResponseDto.from(q, book);
                })
                .toList();
    }


    /**
     * 💬 특정 사용자의 특정 도서에 대한 인용구 목록 조회
     *
     * @param userId 사용자 ID
     * @param bookId 도서 ID
     * @return 인용구 응답 DTO
     */
    @Transactional(readOnly = true)
    public BookQuoteResponseDto findOneQuoteResponseByUserIdAndBookId(Long userId, Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("도서 정보를 찾을 수 없습니다."));

        BookQuote quote = bookQuoteRepository.findByUserIdAndBookId(userId, bookId);
        if (quote == null) {
            // 인용구가 없는 경우 null 반환 (컨트롤러에서 200 OK로 처리됨)
            return null;
        }

        return BookQuoteResponseDto.from(quote, book);
    }

    // userId, bookId로 인용구 존재 여부 확인
    public BookQuote findEntityByUserIdAndBookId(Long userId, Long bookId) {
        return bookQuoteRepository.findByUserIdAndBookId(userId, bookId);
    }

}