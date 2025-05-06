package com.ssafy.bookshy.domain.book.repository;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.users.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    // 사용자 기준 ISBN 중복 방지용
    Optional<Book> findByUserAndIsbn(Users user, String isbn);
}
