package com.ssafy.bookshy.domain.trade.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TradeHistoryService {

    private final TradeRepository tradeRepository;

    /**
     * 완료된 거래 내역을 페이지네이션으로 조회합니다.
     * @param userId 로그인한 사용자 ID
     * @param pageable 페이징 정보
     * @return 완료된 거래 내역 리스트 (연월 단위로 그룹핑)
     */
    public List<TradeHistoryGroupDto> getCompletedTrades(Long userId, Pageable pageable) {
        List<Trade> completedTrades = tradeRepository.findCompletedByUser(userId, pageable);

        // 연월별로 그룹핑 후 DTO 변환
        return completedTrades.stream()
                .map(TradeHistoryDto::fromEntity)
                .collect(Collectors.groupingBy(
                        dto -> dto.getCompletedAt().format(DateTimeFormatter.ofPattern("yyyy.MM")),
                        LinkedHashMap::new, // 정렬 유지
                        Collectors.toList()
                ))
                .entrySet()
                .stream()
                .map(entry -> TradeHistoryGroupDto.builder()
                        .yearMonth(entry.getKey())
                        .trades(entry.getValue())
                        .build())
                .collect(Collectors.toList());
    }
}
