package com.ssafy.bookshy.domain.book.entity;

import com.ssafy.bookshy.domain.library.entity.Library;
import com.ssafy.bookshy.domain.users.entity.Users;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "books")
@Getter @Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id")
    private Long id;

    private Long itemId;

    @Column(nullable = false)
    private String isbn;

    @Column(nullable = false)
    private String title;

    private String author;
    private String publisher;

    private LocalDate pubDate;
    private String coverImageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;
    private String category;
    private Integer pageCount;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime createdAt;

    private Integer exchangeCount;

    /**
     * 📌 현재 이 책을 소유한 사용자 정보
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
    private List<Library> libraries;

    public enum Status {
        AVAILABLE,     // 교환 가능
        EXCHANGING,    // 교환 중
        EXCHANGED      // 교환 완료
    }
}
