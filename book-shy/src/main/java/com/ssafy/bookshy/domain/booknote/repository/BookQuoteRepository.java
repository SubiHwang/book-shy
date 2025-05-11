package com.ssafy.bookshy.domain.booknote.repository;

import com.ssafy.bookshy.domain.booknote.entity.BookQuote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookQuoteRepository extends JpaRepository<BookQuote, Long> {
    List<BookQuote> findByUserIdAndBookId(Long userId, Long bookId);
}
