package com.ssafy.bookshy.domain.autocomplete.controller;

import com.ssafy.bookshy.domain.autocomplete.dto.AutoCompleteResponseDto;
import com.ssafy.bookshy.domain.autocomplete.service.AutoCompleteService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auto")
@RequiredArgsConstructor
@Tag(name = "📍 자동 완성 API", description = "도서 검색 시 자동완성 하는 API")
public class AutoCompleteController {

    private final AutoCompleteService autoCompleteService;


    @GetMapping
    public ResponseEntity<AutoCompleteResponseDto> getAutoCompletion(
            @RequestParam("q") String query
    ) {
        AutoCompleteResponseDto autoCompleteResponseDto = autoCompleteService.getAutoCompletion(query);
        return ResponseEntity.ok(autoCompleteResponseDto);
    }


}
