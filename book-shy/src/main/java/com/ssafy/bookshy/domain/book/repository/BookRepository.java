package com.ssafy.bookshy.domain.book.repository;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.users.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    // 사용자 기준 ISBN 중복 방지용
    Optional<Book> findByUserAndIsbn(Users user, String isbn);
    /**
     * 책 ID를 기준으로 책 정보를 조회합니다.
     *
     * @param id 책 ID
     * @return 해당 ID를 가진 책 객체 (Optional)
     */
    Optional<Book> findById(Long id);

    /**
     * 교환 가능한 상태(AVAILABLE)인 책만 필터링할 때 사용 가능
     * 추후 필요 시 추가 쿼리 메서드 확장 가능
     */
    boolean existsByIdAndStatus(Long id, Book.Status status);

    Optional<Book> findByAladinItemId(Long aladinItemId);
}
