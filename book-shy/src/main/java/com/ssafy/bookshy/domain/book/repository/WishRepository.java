package com.ssafy.bookshy.domain.book.repository;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.book.entity.Wish;
import com.ssafy.bookshy.domain.users.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishRepository extends JpaRepository<Wish, Long> {

    boolean existsByUserAndBook(Users user, Book book);
    Optional<Wish> findByUserAndBook(Users user, Book book);
    List<Wish> findAllByUser(Users user);
    void deleteByUserAndBook(Users user, Book book);
}
