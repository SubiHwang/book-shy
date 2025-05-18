package com.ssafy.bookshy.domain.library.controller;

import com.ssafy.bookshy.common.response.CommonResponse;
import com.ssafy.bookshy.domain.library.dto.LibraryResponseDto;
import com.ssafy.bookshy.domain.library.dto.LibrarySearchAddRequestDto;
import com.ssafy.bookshy.domain.library.dto.LibrarySelfAddRequestDto;
import com.ssafy.bookshy.domain.library.dto.LibraryWithTripResponseDto;
import com.ssafy.bookshy.domain.library.service.LibraryService;
import com.ssafy.bookshy.domain.users.entity.Users;
import com.ssafy.bookshy.domain.users.repository.UserRepository;
import com.ssafy.bookshy.domain.users.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Tag(name = "📚 서재 API", description = "도서 서재 등록 및 조회 API")
@RestController
@RequestMapping("/api/library")
@RequiredArgsConstructor
public class LibraryController {

    private final LibraryService libraryService;
    private final UserRepository userRepository;
    private final UserService userService;

    @Operation(summary = "📘 ISBN 기반 도서 등록", description = "사용자 ID와 ISBN13을 파라미터로 받아 도서를 등록하고 서재에 추가합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "등록 성공"),
            @ApiResponse(responseCode = "400", description = "중복 등록 또는 잘못된 요청"),
            @ApiResponse(responseCode = "404", description = "도서 또는 사용자 없음")
    })
    @PostMapping("/isbn")
    public CommonResponse<LibraryResponseDto> registerByIsbn(
            @AuthenticationPrincipal Users user,
            @RequestParam @Parameter(description = "ISBN13", example = "9788934951711") String isbn13,
            @RequestParam(required = false, defaultValue = "false")
            @Parameter(description = "공개 여부 (기본값: false)") Boolean isPublic
    ) {
        Long userId = user.getUserId();
        return CommonResponse.success(libraryService.registerByIsbn(userId, isbn13, isPublic));
    }


    @Operation(summary = "✖\uFE0F 서재에서 도서 제거", description = "libraryId 기준으로 서재 도서를 삭제합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "삭제 성공"),
            @ApiResponse(responseCode = "404", description = "서재 항목이 존재하지 않음")
    })
    @DeleteMapping("/{libraryId}")
    public CommonResponse<Void> delete(
            @PathVariable @Parameter(description = "서재 ID") Long libraryId) {
        libraryService.removeFromLibrary(libraryId);
        return CommonResponse.success();
    }

    @Operation(summary = "🔄 공개 여부 설정", description = "도서를 공개/비공개로 전환합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "설정 성공"),
            @ApiResponse(responseCode = "404", description = "서재 항목이 존재하지 않음")
    })
    @PatchMapping("/{libraryId}/public")
    public CommonResponse<Void> setPublic(
            @PathVariable @Parameter(description = "서재 ID") Long libraryId,
            @RequestParam @Parameter(description = "true: 공개 / false: 비공개") boolean isPublic
    ) {
        libraryService.setPublic(libraryId, isPublic);
        return CommonResponse.success();
    }

    @Operation(summary = "📗 전체 서재 조회", description = "특정 사용자의 전체 서재 도서를 조회합니다.")
    @GetMapping
    public CommonResponse<List<LibraryResponseDto>> getLibrary(
            @AuthenticationPrincipal Users userDetails) {

        Long userId = userDetails.getUserId();
        userService.updateLastActiveAt(userId);

        return CommonResponse.success(libraryService.findLibraryByUser(userId));
    }

    @Operation(summary = "📗 공개 서재 조회", description = "특정 사용자의 공개된 도서만 조회합니다.")
    @GetMapping("/public")
    public CommonResponse<List<LibraryResponseDto>> getPublicLibrary(
            @AuthenticationPrincipal Users user) {
        Long userId = user.getUserId();
        return CommonResponse.success(libraryService.findPublicLibraryByUser(userId));
    }

    @Operation(summary = "📊 서재 통계 조회", description = "사용자의 전체 등록 도서 수 및 공개 도서 수를 반환합니다.")
    @GetMapping("/count")
    public CommonResponse<Map<String, Long>> getCounts(
            @AuthenticationPrincipal Users user) {
        Long userId = user.getUserId();
        return CommonResponse.success(libraryService.countLibrary(userId));
    }

    @Operation(summary = "➕ 검색 결과 도서 서재 등록", description = "검색된 도서 중 하나를 선택하여 서재에 추가합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "등록 성공"),
            @ApiResponse(responseCode = "400", description = "중복 등록 또는 잘못된 요청"),
            @ApiResponse(responseCode = "404", description = "도서 또는 사용자 없음")
    })
    @PostMapping("/search/add")
    public CommonResponse<LibraryResponseDto> addBookFromSearch(
            @AuthenticationPrincipal Users user,
            @RequestParam @Parameter(description = "알라딘 Item ID", example = "123456789") Long itemId
    ) {
        Long userId = user.getUserId();
        LibrarySearchAddRequestDto dto = new LibrarySearchAddRequestDto(userId, itemId);
        return CommonResponse.success(libraryService.addBookFromSearch(dto));
    }

    @Operation(summary = "✍ 직접 도서 등록", description = "사용자가 표지 이미지와 책 정보를 입력하여 도서를 서재에 직접 등록합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "등록 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
    })
    @PostMapping(value = "/self/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CommonResponse<LibraryResponseDto> addSelfBook(
            @AuthenticationPrincipal Users user,
            @Parameter(description = "도서 제목", example = "총 균 쇠") @RequestParam String title,
            @Parameter(description = "저자", example = "제레드 다이아몬드") @RequestParam String author,
            @Parameter(description = "출판사", example = "김영사") @RequestParam String publisher,
            @Parameter(description = "표지 이미지 파일") @RequestPart MultipartFile coverImage,
            @Parameter(description = "공개 여부", example = "false") @RequestParam boolean isPublic
    ) {
        Long userId = user.getUserId();
        LibrarySelfAddRequestDto dto = LibrarySelfAddRequestDto.builder()
                .userId(userId)
                .title(title)
                .author(author)
                .publisher(publisher)
                .coverImage(coverImage)
                .isPublic(isPublic)
                .build();

        return CommonResponse.success(libraryService.addSelfBook(dto));
    }

    @GetMapping("/unwritten-notes")
    @Operation(
            summary = "📘✏️ 독후감 미작성 도서 목록 조회",
            description = """
                    🔒 <b>로그인 사용자의 인증 정보</b>를 기반으로,<br>
                    <b>아직 독후감을 작성하지 않은 도서 목록</b>을 반환합니다.<br><br>
                    ✅ 반환 정보:
                    - `libraryId`, `bookId`, `aladinItemId`, `isbn13`, `title`, `author`, `coverImageUrl`, `description` 포함<br>
                    ✅ 응답 데이터는 피그마 UI 구성에 맞게 `description` 도 포함됩니다.
                    """,
            responses = {
                    @ApiResponse(responseCode = "200", description = "📚 독후감 미작성 도서 목록 반환"),
                    @ApiResponse(responseCode = "401", description = "❌ 인증 실패"),
                    @ApiResponse(responseCode = "500", description = "💥 서버 오류")
            }
    )
    public CommonResponse<List<LibraryResponseDto>> getUnwrittenNoteBooks(@AuthenticationPrincipal Users user) {
        return CommonResponse.success(libraryService.findUnwrittenNotesByUserId(user.getUserId()));
    }

    @Operation(
            summary = "📘 서재 목록 + 여정 작성 여부 조회",
            description = "로그인한 사용자의 전체 서재 목록을 반환하고, 각 책에 대해 여정 작성 여부(hasTrip)를 함께 반환합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "✅ 서재 + 여정 여부 반환 성공"),
                    @ApiResponse(responseCode = "401", description = "❌ 인증 실패"),
                    @ApiResponse(responseCode = "500", description = "💥 서버 오류")
            }
    )
    @GetMapping("/with-trip")
    public CommonResponse<List<LibraryWithTripResponseDto>> getLibraryWithTrip(
            @AuthenticationPrincipal Users user) {
        return CommonResponse.success(libraryService.findLibraryWithTripStatus(user.getUserId()));
    }

}
