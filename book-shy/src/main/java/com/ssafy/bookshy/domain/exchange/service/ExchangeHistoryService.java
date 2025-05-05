package com.ssafy.bookshy.domain.exchange.service;

import com.ssafy.bookshy.domain.book.entity.Book;
import com.ssafy.bookshy.domain.book.repository.BookRepository;
import com.ssafy.bookshy.domain.exchange.dto.ExchangeHistoryDto;
import com.ssafy.bookshy.domain.exchange.dto.ExchangeHistoryGroupDto;
import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequest;
import com.ssafy.bookshy.domain.exchange.entity.ExchangeRequest.RequestStatus;
import com.ssafy.bookshy.domain.exchange.repository.ExchangeRequestRepository;
import com.ssafy.bookshy.domain.users.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import static com.ssafy.bookshy.common.constants.ImageUrlConstants.PROFILE_IMAGE_BASE_URL;
import static com.ssafy.bookshy.common.constants.ImageUrlConstants.COVER_IMAGE_BASE_URL;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExchangeHistoryService {

    private final ExchangeRequestRepository exchangeRequestRepository;
    private final UserService userService;
    private final BookRepository bookRepository;

    /**
     * 완료된 교환 요청 내역을 조회합니다.
     * 완료된 요청만 가져오며, 사용자 ID 기준으로 필터링됩니다.
     * @param userId 현재 로그인한 사용자 ID
     * @param pageable 페이지네이션 정보
     * @return 완료된 교환 내역 그룹 (연월별)
     */
    @Transactional
    public Page<ExchangeHistoryGroupDto> getCompletedExchanges(Long userId, Pageable pageable) {
        List<ExchangeRequest> completedRequests =
                exchangeRequestRepository.findByUserAndStatus(userId, RequestStatus.COMPLETED, pageable);

        List<ExchangeHistoryDto> dtoList = completedRequests.stream().map(request -> {
            Long counterpartId = request.getRequesterId().equals(userId)
                    ? request.getResponderId()
                    : request.getRequesterId();

            String nickname = userService.getNicknameById(counterpartId);
            String profileImageUrl = userService.getProfileImageUrlById(counterpartId);

            Long receivedBookId = request.getRequesterId().equals(userId)
                    ? request.getBookBId()
                    : request.getBookAId();

            Book receivedBook = bookRepository.findById(receivedBookId)
                    .orElseThrow(() -> new RuntimeException("책 정보를 찾을 수 없습니다."));

            return ExchangeHistoryDto.builder()
                    .tradeId(request.getRequestId())
                    .counterpartNickname(nickname)
                    .counterpartProfileImageUrl(PROFILE_IMAGE_BASE_URL + profileImageUrl)
                    .place("추후 구현된 장소 정보")
                    .completedAt(request.getRequestedAt())
                    .receivedBookTitle(receivedBook.getTitle())
                    .receivedBookAuthor(receivedBook.getAuthor())
                    .receivedBookCoverUrl(COVER_IMAGE_BASE_URL + receivedBook.getCoverImageUrl())
                    .build();
        }).toList();

        // Group by yearMonth
        Map<String, List<ExchangeHistoryDto>> grouped = dtoList.stream()
                .collect(Collectors.groupingBy(
                        dto -> dto.getCompletedAt().format(DateTimeFormatter.ofPattern("yyyy.MM")),
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

        List<ExchangeHistoryGroupDto> groupedDtos = grouped.entrySet().stream()
                .map(entry -> ExchangeHistoryGroupDto.builder()
                        .yearMonth(entry.getKey())
                        .trades(entry.getValue())
                        .build())
                .toList();

        return new PageImpl<>(groupedDtos, pageable, groupedDtos.size());
    }

}
