package com.ssafy.bookshy.domain.recommend.controller;

import com.ssafy.bookshy.domain.recommend.dto.RecommendBooksDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommend")
@Slf4j
@RequiredArgsConstructor
public class RecommendController {


    @GetMapping("/books")
    public ResponseEntity<RecommendBooksDto> recommend() {


        return ResponseEntity.ok();
    }


}
