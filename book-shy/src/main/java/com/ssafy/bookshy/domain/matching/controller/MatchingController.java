package com.ssafy.bookshy.domain.matching.controller;

import com.ssafy.bookshy.domain.matching.dto.MatchChatRequestDto;
import com.ssafy.bookshy.domain.matching.dto.MatchingPageResponseDto;
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


@Tag(name = "🤝 매칭 API", description = "도서 교환 매칭 관련 API입니다.")
@RestController
@RequestMapping("/api/matching")
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService matchingService;

    @Operation(summary = "📋 매칭 후보 조회", description = "도서 조건이 맞는 상대방 중, 점수 높은 순으로 목록을 반환합니다.")
    @ApiResponse(responseCode = "200", description = "매칭 후보 조회 성공")
    @GetMapping("/candidates")
    public ResponseEntity<MatchingPageResponseDto> getMatchingCandidates(
            @Parameter(hidden = true) @AuthenticationPrincipal Users user,
            @RequestParam(defaultValue = "1") int page
    ) {
        MatchingPageResponseDto response = matchingService.findPagedCandidates(user.getUserId(), page, 10);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "✅ 매칭 확정 요청",
            description = "선택한 책과 상대방 ID를 기반으로 매칭 요청을 보냅니다. Kafka 이벤트를 통해 채팅방이 생성됩니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "매칭 요청 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터")
    })
    @PostMapping("/chat")
    public ResponseEntity<Long> chatMatching(
            @Parameter(hidden = true) @AuthenticationPrincipal Users user,
            @RequestParam @Parameter(description = "내가 줄 책의 ID", example = "10") Long bookAId,
            @RequestParam @Parameter(description = "상대가 가진 책의 ID", example = "20") Long bookBId,
            @RequestParam @Parameter(description = "상대 사용자 ID", example = "2") Long receiverId) {

        MatchChatRequestDto requestDto = new MatchChatRequestDto();
        requestDto.setBookAId(bookAId);
        requestDto.setBookBId(bookBId);
        requestDto.setReceiverId(receiverId);

        Long matchId = matchingService.chatMatching(user.getUserId(), requestDto);
        return ResponseEntity.ok(matchId);
    }
}
