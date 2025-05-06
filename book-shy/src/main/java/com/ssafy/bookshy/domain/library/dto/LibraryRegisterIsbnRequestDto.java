package com.ssafy.bookshy.domain.library.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LibraryRegisterIsbnRequestDto {
    private Long userId;
    private String isbn13;
    private Boolean isPublic;
}
