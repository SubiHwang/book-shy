package com.ssafy.bookshy.domain.library.repository;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.library.entity.Library;
import com.ssafy.bookshy.domain.users.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LibraryRepository extends JpaRepository<Library, Long> {
    List<Library> findByUser(Users user);
    List<Library> findAllByUserOrderByRegisteredAtDesc(Users user); // 전체 서재
    List<Library> findByUserAndIsPublicTrueOrderByRegisteredAtDesc(Users user); // 공개 서재
    long countByUser(Users user);
    long countByUserAndIsPublicTrue(Users user);
    boolean existsByUserAndBook(Users user, Book book);

    // 후보 유저 조회
    @Query("""
    SELECT DISTINCT l.user FROM Library l 
    WHERE l.isPublic = true 
    AND l.book.id IN (
        SELECT w.book.id FROM Wish w WHERE w.user.userId = :myUserId
    )
    AND l.user.userId <> :myUserId
    """)
    List<Users> findCandidatesByMyWishBooks(@Param("myUserId") Long myUserId);

    // 내 wish → 상대의 공개 서재에 있는지 확인
    @Query("""
    SELECT l FROM Library l 
    WHERE l.isPublic = true 
    AND l.user.userId = :otherUserId
    AND l.book.id IN (
        SELECT w.book.id FROM Wish w WHERE w.user.userId = :myUserId
    )
    """)
    List<Library> findTheirLibrariesMatchingMyWishes(@Param("myUserId") Long myUserId, @Param("otherUserId") Long otherUserId);

    // 상대 wish → 내 공개 서재에 있는지 확인
    @Query("""
    SELECT l FROM Library l 
    WHERE l.isPublic = true 
    AND l.user.userId = :myUserId
    AND l.book.id IN (
        SELECT w.book.id FROM Wish w WHERE w.user.userId = :otherUserId
    )
    """)
    List<Library> findMyLibrariesMatchingTheirWishes(@Param("myUserId") Long myUserId, @Param("otherUserId") Long otherUserId);

    boolean existsByUserUserIdAndBookItemId(Long userId, Long itemId);

    @Modifying
    @Query("UPDATE Library l SET l.user.userId = :newUserId WHERE l.id = :libraryId")
    void updateLibraryOwner(@Param("libraryId") Long libraryId, @Param("newUserId") Long newUserId);

    Optional<Library> findByUserAndBook_Id(Users user, Long bookId);
}
