package com.ssafy.bookshy.domain.booknote.service;

import com.ssafy.bookshy.domain.booknote.dto.*;
import com.ssafy.bookshy.domain.booknote.entity.BookNote;
import com.ssafy.bookshy.domain.booknote.entity.BookQuote;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookNoteQuoteService {

    private final BookNoteService bookNoteService;
    private final BookQuoteService bookQuoteService;

    /**
     * 📝💬 독후감과 인용구를 동시에 등록합니다.
     * - 전체 트랜잭션이 보장되며, 하나라도 실패 시 모두 롤백됩니다.
     */
    @Transactional
    public BookNoteQuoteResponse registerNoteAndQuote(BookNoteQuoteRequest request) {
        Long userId = request.getUserId();
        Long bookId = request.getBookId();

        // 1. 독후감 존재 여부 확인
        BookNote existingNote = bookNoteService.findEntityByUserIdAndBookId(userId, bookId); // ❗ 아래에 이 메서드도 구현 필요
        BookNote savedNote;
        if (existingNote == null) {
            savedNote = bookNoteService.create(
                    BookNoteRequest.builder()
                            .userId(userId)
                            .bookId(bookId)
                            .content(request.getReviewContent())
                            .build()
            );
        } else {
            savedNote = bookNoteService.update(existingNote.getReviewId(),
                    BookNoteRequest.builder()
                            .content(request.getReviewContent())
                            .build()
            );
        }

        // 2. 인용구 존재 여부 확인
        BookQuote existingQuote = bookQuoteService.findEntityByUserIdAndBookId(userId, bookId);
        BookQuote savedQuote;
        if (existingQuote == null) {
            savedQuote = bookQuoteService.create(
                    BookQuoteRequest.builder()
                            .userId(userId)
                            .bookId(bookId)
                            .content(request.getQuoteContent())
                            .build()
            );
        } else {
            savedQuote = bookQuoteService.update(existingQuote.getQuoteId(),
                    BookQuoteRequest.builder()
                            .content(request.getQuoteContent())
                            .build()
            );
        }

        return BookNoteQuoteResponse.builder()
                .reviewId(savedNote.getReviewId())
                .quoteId(savedQuote.getQuoteId())
                .status("SUCCESS")
                .message("독후감과 인용구가 성공적으로 저장되었습니다.")
                .build();
    }


    @Transactional
    public BookNoteQuoteResponse updateNoteAndQuote(Long reviewId, Long quoteId, BookNoteQuoteUpdateRequest request) {
        // 1. 독후감 수정
        BookNoteRequest noteUpdate = BookNoteRequest.builder()
                .content(request.getReviewContent())
                .build();
        BookNote updatedNote = bookNoteService.update(reviewId, noteUpdate);

        // 2. 인용구 수정
        BookQuoteRequest quoteUpdate = BookQuoteRequest.builder()
                .content(request.getQuoteContent())
                .build();
        BookQuote updatedQuote = bookQuoteService.update(quoteId, quoteUpdate);

        return BookNoteQuoteResponse.builder()
                .reviewId(updatedNote.getReviewId())
                .quoteId(updatedQuote.getQuoteId())
                .status("SUCCESS")
                .message("독후감과 인용구가 성공적으로 수정되었습니다.")
                .build();
    }

}
