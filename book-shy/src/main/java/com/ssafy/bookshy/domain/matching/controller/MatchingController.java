package com.ssafy.bookshy.domain.matching.controller;

import com.ssafy.bookshy.domain.library.dto.LibraryResponseDto;
import com.ssafy.bookshy.domain.library.service.LibraryService;
import com.ssafy.bookshy.domain.matching.dto.*;
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
    private final LibraryService libraryService;

    @Operation(summary = "📋 매칭 후보 조회", description = "도서 조건이 맞는 상대방 중, 점수 높은 순으로 목록을 반환합니다.")
    @ApiResponse(responseCode = "200", description = "매칭 후보 조회 성공")
    @GetMapping("/candidates")
    public ResponseEntity<MatchingPageResponseDto> getMatchingCandidates(
            @Parameter(hidden = true) @AuthenticationPrincipal Users user,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "score") String sort
    ) {
        MatchingPageResponseDto response = matchingService.findPagedCandidates(user.getUserId(), page, 2, sort);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "✅ 매칭 후 채팅방 생성",
            description = "매칭 조건에 맞는 상대방 ID를 기반으로 매칭 요청을 보냅니다. Kafka 이벤트를 통해 채팅방이 생성됩니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "매칭 요청 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터")
    })
    @PostMapping("/chat")
    public ResponseEntity<MatchResponseDto> chatMatching(
            @Parameter(hidden = true) @AuthenticationPrincipal Users user,
            @RequestParam @Parameter(description = "상대 사용자 ID", example = "1") Long receiverId,
            @RequestBody MatchChatRequestDto requestDto) {

        requestDto.setReceiverId(receiverId);
        MatchResponseDto response = matchingService.chatMatching(user.getUserId(), requestDto);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "📍 주변 이웃 목록 조회",
            description = "현재 사용자의 위치를 기준으로 반경 20km 이내에 있는 다른 사용자들을 거리순으로 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @GetMapping("/neighbors")
    public ResponseEntity<List<NearbyUserResponseDto>> getNearbyUsers(
            @Parameter(hidden = true) @AuthenticationPrincipal Users user
    ) {
        List<NearbyUserResponseDto> neighbors = matchingService.findNearbyUsers(user);
        return ResponseEntity.ok(neighbors);
    }

    @Operation(
            summary = "📗 이웃 주민의 공개 서재 조회",
            description = "사용자 ID를 기반으로 해당 사용자의 공개된 도서를 최신순으로 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @GetMapping("/public/{userId}")
    public ResponseEntity<NeighborLibraryResponseDto> getPublicLibraryByUserId(
            @Parameter(description = "공개 서재를 조회할 이웃 주민 ID", example = "1")
            @PathVariable Long userId,
            @AuthenticationPrincipal Users viewer
    ) {
        return ResponseEntity.ok(matchingService.getNeighborLibrary(userId, viewer.getUserId()));
    }
}
