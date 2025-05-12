package com.ssafy.bookshy.domain.booktrip.repository;

import com.ssafy.bookshy.domain.booktrip.entity.BookTrip;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookTripRepository extends JpaRepository<BookTrip, Long> {
    List<BookTrip> findByBookId(Long bookId);
}