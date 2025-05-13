package com.ssafy.bookshy.domain.matching.controller;

import com.ssafy.bookshy.domain.matching.dto.MatchConfirmRequestDto;
import com.ssafy.bookshy.domain.matching.dto.MatchingDto;
import com.ssafy.bookshy.domain.matching.entity.Matching;
import com.ssafy.bookshy.domain.matching.repository.MatchingRepository;
import com.ssafy.bookshy.domain.matching.service.MatchingService;
import com.ssafy.bookshy.domain.users.entity.Users;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "🤝 매칭 API", description = "도서 교환 매칭 관련 API입니다.")
@RestController
@RequestMapping("/api/matching")
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService matchingService;
    private final MatchingRepository matchingRepository;

    @Operation(summary = "📋 매칭 후보 3명 조회", description = "도서 조건이 맞는 상대방 중, 점수 높은 순으로 3명을 반환합니다.")
    @ApiResponse(responseCode = "200", description = "매칭 후보 조회 성공")
    @GetMapping("/candidates")
    public ResponseEntity<List<MatchingDto>> getMatchingCandidates(
            @Parameter(hidden = true) @AuthenticationPrincipal Users user) {
        List<MatchingDto> candidates = matchingService.findTop3Candidates(user.getUserId());
        return ResponseEntity.ok(candidates);
    }

    @Operation(
            summary = "✅ 매칭 확정 요청",
            description = "선택한 책과 상대방 ID를 기반으로 매칭 요청을 보냅니다. Kafka 이벤트를 통해 채팅방이 생성됩니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "매칭 요청 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터")
    })
    @PostMapping("/confirm")
    public ResponseEntity<Long> confirmMatching(
            @Parameter(hidden = true) @AuthenticationPrincipal Users user,
            @RequestParam @Parameter(description = "내가 줄 책의 ID", example = "10") Long bookAId,
            @RequestParam @Parameter(description = "상대가 가진 책의 ID", example = "20") Long bookBId,
            @RequestParam @Parameter(description = "상대 사용자 ID", example = "2") Long receiverId) {

        MatchConfirmRequestDto requestDto = new MatchConfirmRequestDto();
        requestDto.setBookAId(bookAId);
        requestDto.setBookBId(bookBId);
        requestDto.setReceiverId(receiverId);

        Long matchId = matchingService.confirmMatching(user.getUserId(), requestDto);
        return ResponseEntity.ok(matchId);
    }

    @Operation(summary = "📜 나의 매칭 내역 조회", description = "내가 참여한 모든 매칭 목록을 조회합니다.")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping("/my")
    public ResponseEntity<List<MatchingDto>> getMyMatchings(
            @Parameter(hidden = true) @AuthenticationPrincipal Users user) {
        List<Matching> matches = matchingRepository.findByUserId(user.getUserId());
        return ResponseEntity.ok(matches.stream()
                .map(m -> MatchingDto.from(m, 0.0)) // 점수는 단순히 0으로 처리
                .toList());
    }
}
