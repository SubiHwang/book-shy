package com.ssafy.bookshy.domain.users.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FavoriteCategoryResponseDto {
    private String favoriteCategory;
    private String message;
}
