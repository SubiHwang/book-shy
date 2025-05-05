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
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
    public List<ExchangeHistoryGroupDto> getCompletedExchanges(Long userId, Pageable pageable) {
        // 나와 관련 있고 완료된 교환 요청 조회
        List<ExchangeRequest> completedRequests =
                exchangeRequestRepository.findByUserAndStatus(userId, RequestStatus.ACCEPTED, pageable);

        List<ExchangeHistoryDto> dtoList = new ArrayList<>();

        for (ExchangeRequest request : completedRequests) {
            Long counterpartId = request.getRequesterId().equals(userId)
                    ? request.getResponderId()
                    : request.getRequesterId();

            // 사용자 정보 조회
            String nickname = userService.getNicknameById(counterpartId);
            String profileImageUrl = userService.getProfileImageUrlById(counterpartId);

            // 책 정보 조회 (내가 받은 책 기준)
            Long receivedBookId = request.getRequesterId().equals(userId)
                    ? request.getBookBId()
                    : request.getBookAId();

            Book receivedBook = bookRepository.findById(receivedBookId)
                    .orElseThrow(() -> new RuntimeException("책 정보를 찾을 수 없습니다."));

            // DTO 생성
            ExchangeHistoryDto dto = ExchangeHistoryDto.builder()
                    .tradeId(request.getRequestId())
                    .counterpartNickname(nickname)
                    .counterpartProfileImageUrl(profileImageUrl)
                    .place("추후 구현된 장소 정보") // 현재 엔티티에는 장소 정보 없음
                    .completedAt(request.getRequestedAt()) // 확정일자로 대체
                    .receivedBookTitle(receivedBook.getTitle())
                    .receivedBookAuthor(receivedBook.getAuthor())
                    .receivedBookCoverUrl(receivedBook.getCoverImageUrl())
                    .build();

            dtoList.add(dto);
        }

        // 연월별로 그룹핑하여 결과 반환
        return dtoList.stream()
                .collect(Collectors.groupingBy(
                        dto -> dto.getCompletedAt().format(DateTimeFormatter.ofPattern("yyyy.MM")),
                        LinkedHashMap::new, // 입력 순서 유지
                        Collectors.toList()
                ))
                .entrySet()
                .stream()
                .map(entry -> ExchangeHistoryGroupDto.builder()
                        .yearMonth(entry.getKey())
                        .trades(entry.getValue())
                        .build())
                .collect(Collectors.toList());
    }
}
