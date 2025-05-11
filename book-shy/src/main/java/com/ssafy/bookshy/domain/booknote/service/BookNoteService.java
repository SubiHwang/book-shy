package com.ssafy.bookshy.domain.booknote.service;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.book.repository.BookRepository;
import com.ssafy.bookshy.domain.booknote.dto.BookNoteRequest;
import com.ssafy.bookshy.domain.booknote.dto.BookNoteResponseDto;
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
public class BookNoteService {

    private final BookNoteRepository bookNoteRepository;
    private final BookRepository bookRepository;

    @Transactional
    public BookNote create(BookNoteRequest request) {
        BookNote note = BookNote.builder()
                .userId(request.getUserId())
                .bookId(request.getBookId())
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .build();
        return bookNoteRepository.save(note);
    }

    @Transactional
    public BookNote update(Long reviewId, BookNoteRequest request) {
        BookNote note = bookNoteRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("해당 독후감이 존재하지 않습니다."));
        note.setContent(request.getContent());
        return note;
    }

    /**
     * 📘 사용자 ID로 독후감 목록을 조회합니다.
     * - 도서 ID를 기반으로 도서 정보(title, author 등)를 함께 조합해 반환할 수 있도록 준비합니다.
     */
    @Transactional(readOnly = true)
    public List<BookNoteResponseDto> findNoteResponsesByUserId(Long userId) {
        return bookNoteRepository.findAll().stream()
                .filter(note -> note.getUserId().equals(userId))
                .map(note -> {
                    Book book = bookRepository.findById(note.getBookId())
                            .orElseThrow(() -> new IllegalArgumentException("도서 정보를 찾을 수 없습니다."));
                    return BookNoteResponseDto.from(note, book);
                })

                .toList();
    }

    /**
     * 📘 특정 사용자의 특정 도서에 대한 독후감 조회
     * - 해당 사용자의 해당 도서에 등록된 모든 독후감을 가져옵니다.
     * - 도서 정보(title, author 등)를 함께 응답에 포함합니다.
     *
     * @param userId 사용자 ID
     * @param bookId 도서 ID
     * @return 독후감 응답 리스트
     */
    @Transactional(readOnly = true)
    public List<BookNoteResponseDto> findNoteResponsesByUserIdAndBookId(Long userId, Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("도서 정보를 찾을 수 없습니다."));

        return bookNoteRepository.findByUserIdAndBookId(userId, bookId).stream()
                .map(note -> BookNoteResponseDto.from(note, book))
                .toList();
    }


}