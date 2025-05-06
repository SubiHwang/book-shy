package com.ssafy.bookshy.domain.library.controller;

import com.ssafy.bookshy.domain.library.dto.LibraryResponseDto;
import com.ssafy.bookshy.domain.library.service.LibraryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "📚 서재 API", description = "도서 서재 등록 및 조회 API")
@RestController
@RequestMapping("/api/library")
@RequiredArgsConstructor
public class LibraryController {

    private final LibraryService libraryService;

    @Operation(summary = "📘 ISBN 기반 도서 등록", description = "사용자 ID와 ISBN13을 파라미터로 받아 도서를 등록하고 서재에 추가합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "등록 성공"),
            @ApiResponse(responseCode = "400", description = "중복 등록 또는 잘못된 요청"),
            @ApiResponse(responseCode = "404", description = "도서 또는 사용자 없음")
    })
    @PostMapping("/isbn")
    public ResponseEntity<LibraryResponseDto> registerByIsbn(
            @RequestParam @Parameter(description = "사용자 ID", example = "1") Long userId,
            @RequestParam @Parameter(description = "ISBN13", example = "9788934951711") String isbn13,
            @RequestParam(required = false, defaultValue = "false")
            @Parameter(description = "공개 여부 (기본값: false)") Boolean isPublic
    ) {
        return ResponseEntity.ok(libraryService.registerByIsbn(userId, isbn13, isPublic));
    }


    @Operation(summary = "✖\uFE0F 서재에서 도서 제거", description = "libraryId 기준으로 서재 도서를 삭제합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "삭제 성공"),
            @ApiResponse(responseCode = "404", description = "서재 항목이 존재하지 않음")
    })
    @DeleteMapping("/{libraryId}")
    public ResponseEntity<Void> delete(
            @PathVariable @Parameter(description = "서재 ID") Long libraryId) {
        libraryService.removeFromLibrary(libraryId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "🔄 공개 여부 설정", description = "도서를 공개/비공개로 전환합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "설정 성공"),
            @ApiResponse(responseCode = "404", description = "서재 항목이 존재하지 않음")
    })
    @PatchMapping("/{libraryId}/public")
    public ResponseEntity<Void> setPublic(
            @PathVariable @Parameter(description = "서재 ID") Long libraryId,
            @RequestParam @Parameter(description = "true: 공개 / false: 비공개") boolean isPublic
    ) {
        libraryService.setPublic(libraryId, isPublic);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "📗 전체 서재 조회", description = "특정 사용자의 전체 서재 도서를 조회합니다.")
    @GetMapping
    public ResponseEntity<List<LibraryResponseDto>> getLibrary(
            @RequestParam @Parameter(description = "사용자 ID") Long userId) {
        return ResponseEntity.ok(libraryService.findLibraryByUser(userId));
    }

    @Operation(summary = "📗 공개 서재 조회", description = "특정 사용자의 공개된 도서만 조회합니다.")
    @GetMapping("/public")
    public ResponseEntity<List<LibraryResponseDto>> getPublicLibrary(
            @RequestParam @Parameter(description = "사용자 ID") Long userId) {
        return ResponseEntity.ok(libraryService.findPublicLibraryByUser(userId));
    }

    @Operation(summary = "📊 서재 통계 조회", description = "사용자의 전체 등록 도서 수 및 공개 도서 수를 반환합니다.")
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getCounts(
            @RequestParam @Parameter(description = "사용자 ID") Long userId) {
        return ResponseEntity.ok(libraryService.countLibrary(userId));
    }
}
