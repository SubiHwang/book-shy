package com.ssafy.bookshy.domain.matching.controller;

import com.ssafy.bookshy.domain.matching.dto.MatchingDto;
import com.ssafy.bookshy.domain.matching.service.MatchingService;
import com.ssafy.bookshy.domain.users.entity.Users;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/matching")
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService matchingService;

    @GetMapping("/candidates")
    public ResponseEntity<List<MatchingDto>> getMatchingCandidates(@AuthenticationPrincipal Users user) {
        List<MatchingDto> candidates = matchingService.findTop3Candidates(user.getUserId());
        return ResponseEntity.ok(candidates);
    }
}
