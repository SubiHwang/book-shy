package com.ssafy.bookshy.domain.library.repository;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.library.entity.Library;
import com.ssafy.bookshy.domain.users.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LibraryRepository extends JpaRepository<Library, Long> {
    List<Library> findByUser(Users user);
    List<Library> findByUserAndIsPublicTrue(Users user);
    long countByUser(Users user);
    long countByUserAndIsPublicTrue(Users user);
    boolean existsByUserAndBook(Users user, Book book);
}
