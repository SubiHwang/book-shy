package com.ssafy.bookshy.domain.library.repository;

import com.ssafy.bookshy.domain.library.entity.LibraryReadLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface LibraryReadLogRepository extends JpaRepository<LibraryReadLog, Long> {

    @Query("SELECT COUNT(DISTINCT l.bookId) FROM LibraryReadLog l WHERE l.userId = :userId")
    int countDistinctBooksByUserId(Long userId);

    boolean existsByUserIdAndBookId(Long userId, Long bookId);
}
