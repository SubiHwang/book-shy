package com.ssafy.bookshy.domain.library.dto;

import lombok.Builder;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Builder
public class LibrarySelfAddRequestDto {

    private Long userId;
    private String title;
    private String author;
    private String publisher;
    private String description;
    private MultipartFile coverImage;
    private boolean isPublic;
}
