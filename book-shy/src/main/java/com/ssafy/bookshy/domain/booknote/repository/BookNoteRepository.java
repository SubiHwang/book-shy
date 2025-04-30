package com.ssafy.bookshy.domain.booknote.repository;

import com.ssafy.bookshy.domain.booknote.entity.BookNote;
import com.ssafy.bookshy.domain.booknote.entity.BookQuote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookNoteRepository extends JpaRepository<BookNote, Long> {}

