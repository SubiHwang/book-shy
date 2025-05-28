package com.ssafy.bookshy.domain.autocomplete.service;

import com.ssafy.bookshy.common.response.BusinessException;
import com.ssafy.bookshy.domain.autocomplete.dto.AutoCompleteItem;
import com.ssafy.bookshy.domain.autocomplete.dto.AutoCompleteResponseDto;
import com.ssafy.bookshy.domain.autocomplete.exception.AutoCompletionErrorCode;
import com.ssafy.bookshy.domain.book.dto.BookListTotalResponseDto;
import com.ssafy.bookshy.external.aladin.AladinClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class AutoCompleteService {

    private static final int MIN_QUERY_LENGTH = 1;
    private static final int MAX_QUERY_LENGTH = 50;
    private static final String INVALID_CHAR_PATTERN = "[<>\"'\\\\]";
    private static final int MAX_RESULTS = 20;  // 더 많은 결과를 가져와서 필터링
    private static final int DISPLAY_LIMIT = 10; // 표시할 최대 개수

    private final AladinClient aladinClient;

    /**
     * 자동완성 검색 (알라딘 API + 캐싱)
     */
    @Cacheable(value = "aladin:autocomplete", key = "#query", unless = "#result.items.isEmpty()")
    public AutoCompleteResponseDto getAutoCompletion(String query) {

        log.info("=== 자동완성 요청 시작 - query: {} ===", query);

        // 입력값 검증
        validateQuery(query);

        String normalizedQuery = query.replaceAll(" ", "").toLowerCase();

        try {
            log.info("알라딘 API 호출 시작 - query: {}", query);
            BookListTotalResponseDto bookListTotalResponseDto = aladinClient.searchListPreview(query, MAX_RESULTS);

            if (bookListTotalResponseDto == null || bookListTotalResponseDto.getBooks() == null) {
                log.warn("알라딘 API 응답이 null - query: {}", query);
                throw new BusinessException(AutoCompletionErrorCode.NO_RESULTS_FOUND);
            }

            log.info("알라딘 API 응답 받음 - 책 개수: {}", bookListTotalResponseDto.getTotal());

            // 검색 결과가 없는 경우
            if (bookListTotalResponseDto.getBooks().isEmpty()) {
                log.info("검색 결과 없음 - query: {}", query);
                return AutoCompleteResponseDto.builder()
                        .items(new ArrayList<>())
                        .build();
            }

            // 정상 처리
            List<AutoCompleteItem> allItems = convertToAutoCompleteItems(bookListTotalResponseDto, normalizedQuery);

            // 상위 N개만 반환
            List<AutoCompleteItem> limitedItems = allItems.stream()
                    .limit(DISPLAY_LIMIT)
                    .collect(Collectors.toList());

            log.info("=== 자동완성 응답 생성 완료 - query: {}, 총 아이템: {} ===",
                    query, limitedItems.size());

            return AutoCompleteResponseDto.builder()
                    .items(limitedItems)
                    .build();

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("💥 알라딘 API 호출 중 오류 발생 - query: {}", query, e);

            if (e.getMessage() != null && e.getMessage().contains("timeout")) {
                throw new BusinessException(AutoCompletionErrorCode.SEARCH_TIMEOUT);
            }

            throw new BusinessException(AutoCompletionErrorCode.AUTOCOMPLETE_SERVICE_UNAVAILABLE);
        }
    }

    /**
     * 쿼리 유효성 검증
     */
    private void validateQuery(String query) {
        if (query == null || query.trim().isEmpty()) {
            log.debug("📍 쿼리가 null이거나 비어있음");
            throw new BusinessException(AutoCompletionErrorCode.QUERY_TOO_SHORT);
        }

        String trimmedQuery = query.trim();

        if (trimmedQuery.length() < MIN_QUERY_LENGTH) {
            log.debug("📍 쿼리가 너무 짧음: {}", trimmedQuery);
            throw new BusinessException(AutoCompletionErrorCode.QUERY_TOO_SHORT);
        }

        if (trimmedQuery.length() > MAX_QUERY_LENGTH) {
            log.debug("📍 쿼리가 너무 김: {}", trimmedQuery.length());
            throw new BusinessException(AutoCompletionErrorCode.QUERY_TOO_LONG);
        }

        if (trimmedQuery.matches(".*" + INVALID_CHAR_PATTERN + ".*")) {
            log.debug("📍 허용되지 않는 문자 포함: {}", trimmedQuery);
            throw new BusinessException(AutoCompletionErrorCode.INVALID_CHARACTERS);
        }
    }

    /**
     * BookListTotalResponseDto를 AutoCompleteItem 리스트로 변환
     */
    private List<AutoCompleteItem> convertToAutoCompleteItems(BookListTotalResponseDto bookListDto, String query) {
        try {
            // 책 제목 변환 (쿼리가 포함된 것만)
            List<AutoCompleteItem> bookItems = bookListDto.getBooks().stream()
                    .filter(book -> book.getTitle() != null)
                    .filter(book -> book.getTitle().toLowerCase().contains(query))
                    .map(book -> {
                        log.trace("책 제목 변환: {}", book.getTitle());
                        return AutoCompleteItem.builder()
                                .keyword(book.getTitle())
                                .type(AutoCompleteItem.SearchType.BOOK)
                                .build();
                    })
                    .collect(Collectors.toList());

            log.debug("변환된 책 아이템 수: {}", bookItems.size());

            // 작가명 변환 (쿼리가 포함된 것만)
            List<AutoCompleteItem> authorItems = bookListDto.getBooks().stream()
                    .map(book -> book.getAuthor())
                    .filter(author -> author != null && !author.isEmpty())
                    .map(this::cleanAuthorName)  // 먼저 정제
                    .filter(author -> author != null && !author.isEmpty())  // 정제 후 null 체크
                    .filter(author -> author.toLowerCase().contains(query))  // 정제된 작가명으로 필터링
                    .distinct()
                    .map(author -> {
                        log.trace("작가명 변환: {}", author);
                        return AutoCompleteItem.builder()
                                .keyword(author)
                                .type(AutoCompleteItem.SearchType.AUTHOR)
                                .build();
                    })
                    .collect(Collectors.toList());

            log.debug("변환된 작가 아이템 수: {}", authorItems.size());

            // 결과 합치기 (책 제목을 먼저, 그 다음 작가명)
            List<AutoCompleteItem> allItems = new ArrayList<>();
            allItems.addAll(bookItems);
            allItems.addAll(authorItems);

            log.info("최종 자동완성 아이템 수: {} (책: {}, 작가: {})",
                    allItems.size(), bookItems.size(), authorItems.size());

            return allItems;

        } catch (Exception e) {
            log.error("데이터 변환 중 오류 발생", e);
            throw new BusinessException(AutoCompletionErrorCode.DATABASE_ERROR);
        }
    }

    /**
     * 작가명 정제 메서드
     * "지음", "옮김", "글", "그림" 등의 불필요한 텍스트 제거
     */
    private String cleanAuthorName(String rawAuthor) {
        if (rawAuthor == null || rawAuthor.isEmpty()) {
            return null;
        }

        // 여러 작가가 있는 경우 모두 처리
        String[] authors = rawAuthor.split(",");
        List<String> cleanedAuthors = new ArrayList<>();

        for (String author : authors) {
            author = author.trim();

            // 불필요한 텍스트 제거 (정규식 개선)
            author = author.replaceAll("\\s*(지음|옮김|글|그림|저자|역자|편집|엮음|감수|원작).*$", "");
            author = author.replaceAll("\\s*(외|등)\\s*", "");
            author = author.replaceAll("\\s*\\[.*?\\]", ""); // 대괄호 내용 제거
            author = author.replaceAll("\\s*\\(.*?\\)", ""); // 소괄호 내용 제거

            author = author.trim();

            if (!author.isEmpty() && !cleanedAuthors.contains(author)) {
                cleanedAuthors.add(author);
            }
        }

        // 첫 번째 작가만 반환 (또는 전체 작가 반환)
        return cleanedAuthors.isEmpty() ? null : cleanedAuthors.get(0);
    }


}