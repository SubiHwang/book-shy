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
}