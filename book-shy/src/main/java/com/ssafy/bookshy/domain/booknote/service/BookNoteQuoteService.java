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

        // 1. 독후감 등록
        BookNoteRequest noteRequest = BookNoteRequest.builder()
                .userId(request.getUserId())
                .bookId(request.getBookId())
                .content(request.getReviewContent())
                .build();

        BookNote savedNote = bookNoteService.create(noteRequest);

        // 2. 인용구 등록
        BookQuoteRequest quoteRequest = BookQuoteRequest.builder()
                .userId(request.getUserId())
                .bookId(request.getBookId())
                .content(request.getQuoteContent())
                .build();

        BookQuote savedQuote = bookQuoteService.create(quoteRequest);

        // 3. 응답 구성
        return BookNoteQuoteResponse.builder()
                .reviewId(savedNote.getReviewId())
                .quoteId(savedQuote.getQuoteId())
                .status("SUCCESS")
                .message("독후감과 인용구가 성공적으로 등록되었습니다.")
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
