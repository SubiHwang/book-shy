package com.ssafy.bookshy.domain.book.repository;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.book.entity.Wish;
import com.ssafy.bookshy.domain.users.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WishRepository extends JpaRepository<Wish, Long> {

    boolean existsByUserAndBook(Users user, Book book);
    Optional<Wish> findByUserAndBook(Users user, Book book);
    List<Wish> findAllByUser(Users user);
    void deleteByUserAndBook(Users user, Book book);

    @Query("SELECT w.book.id FROM Wish w WHERE w.user = :user")
    List<Long> findBookIdsByUser(@Param("user") Users user);
}
