package com.ssafy.bookshy.domain.booktrip.repository;

import com.ssafy.bookshy.domain.booktrip.entity.BookTrip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookTripRepository extends JpaRepository<BookTrip, Long> {
    List<BookTrip> findByBookId(Long bookId);

    @Query("""
        SELECT bt FROM BookTrip bt
        WHERE bt.userId = :userId
        AND bt.bookId NOT IN (
            SELECT l.book.id FROM Library l WHERE l.user.userId = :userId
        )
    """)
    List<BookTrip> findMyTripsNotInMyLibrary(@Param("userId") Long userId);
}