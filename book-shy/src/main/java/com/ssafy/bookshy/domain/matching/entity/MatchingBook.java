package com.ssafy.bookshy.domain.matching.entity;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.users.entity.Users;
import jakarta.persistence.*;

@Entity
@Table(name = "matching_books")
public class MatchingBook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "match_id")
    private Matching matching;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;

    public enum Role {
        GIVE, RECEIVE
    }
}
