package com.ssafy.bookshy.external.aladin;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.bookshy.domain.book.dto.BookListResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookListTotalResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import org.apache.commons.text.StringEscapeUtils;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AladinClient {

    @Value("${aladin.ttb.key}")
    private String ttbKey;

    @Value("${aladin.api.base-url}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JsonNode searchByIsbn(String isbn) throws Exception {
        String url = UriComponentsBuilder
                .fromHttpUrl(baseUrl + "/ItemLookUp.aspx")
                .queryParam("ttbkey",     ttbKey)
                .queryParam("ItemIdType", "ISBN13")
                .queryParam("ItemId",     isbn)
                .queryParam("OptResult",  "bookinfo")
                .queryParam("output",     "js")
                .toUriString();

        System.out.println("🔍 ISBN 상세 URL: " + url);

        String raw = restTemplate.getForObject(url, String.class);

        // 🔥 전처리 추가
        String clean = StringEscapeUtils.unescapeHtml4(raw)  // HTML 이스케이프 해제
                .replace("\\'", "'")                         // JS용 \' → '
                .replaceAll("[\\n\\r\\t]", " ");             // 제어 문자 제거 (핵심!)

        return objectMapper.readTree(clean);
    }

    public Integer getPageCountByIsbn(String isbn13) {
        try {
            JsonNode detail = this.searchByIsbn(isbn13);
            return detail.path("item").get(0).path("subInfo").path("itemPage").asInt();
        } catch (Exception e) {
            return null;
        }
    }

    public List<BookResponseDto> searchByKeyword(String query) {
        try {
            // ✅ 쿼리 문자열 직접 구성 (인코딩 안 함, 한글 그대로)
            String url = String.format(
                    "%s/ItemSearch.aspx?ttbkey=%s&Query=%s&QueryType=Title&MaxResults=20&OptResult=bookinfo&output=js",
                    baseUrl, ttbKey, query
            );

            System.out.println("✅ 요청 URL: " + url);

            // 🔥 전처리 포함한 응답 처리
            String raw = restTemplate.getForObject(url, String.class);
            String clean = StringEscapeUtils.unescapeHtml4(raw)  // HTML 이스케이프 해제
                    .replace("\\'", "'")                         // JS용 이스케이프 제거
                    .replaceAll("[\\n\\r\\t]", " ")              // 개행, 탭 제거
                    .replaceAll("[\\u0000-\\u001F]", " ");       // 제어 문자 차단

            JsonNode items = objectMapper.readTree(clean).path("item");
            List<BookResponseDto> list = new ArrayList<>();

            for (JsonNode it : items) {
                try {
                    String isbn13 = it.path("isbn13").asText(null);
                    Long itemId = it.path("itemId").asLong(0);

                    JsonNode detail;
                    if (isbn13 != null && !isbn13.isBlank()) {
                        detail = this.searchByIsbn(isbn13);
                    } else if (itemId > 0) {
                        detail = this.searchByItemId(itemId);  // fallback으로 itemId 사용
                    } else {
                        list.add(BookResponseDto.fromAladin(it));  // 둘 다 없으면 원본 사용
                        continue;
                    }

                    JsonNode itemNode = detail.path("item").get(0);
                    list.add(BookResponseDto.fromAladin(itemNode));
                } catch (Exception ex) {
                    System.out.println("❌ 상세 조회 실패 → fallback 사용: " + ex.getMessage());
                    list.add(BookResponseDto.fromAladin(it));
                }
            }

            return list;
        } catch (Exception e) {
            System.out.println("❌ 알라딘 전체 API 실패: " + e.getMessage());
            return new ArrayList<>(); // 빈 목록 반환하여 null 방지
        }
    }

    public JsonNode searchByItemId(Long itemId) throws Exception {
        String url = UriComponentsBuilder
                .fromHttpUrl(baseUrl + "/ItemLookUp.aspx")
                .queryParam("ttbkey", ttbKey)
                .queryParam("ItemIdType", "ItemId")  // 핵심!
                .queryParam("ItemId", itemId)
                .queryParam("OptResult", "bookinfo")
                .queryParam("output", "js")
                .toUriString();

        System.out.println("🔍 ItemId 상세 URL: " + url);

        String raw = restTemplate.getForObject(url, String.class);
        String clean = StringEscapeUtils.unescapeHtml4(raw)
                .replace("\\'", "'")
                .replaceAll("[\\n\\r\\t]", " ")
                .replaceAll("[\\u0000-\\u001F]", " ");
        return objectMapper.readTree(clean);
    }

    public BookListTotalResponseDto searchListPreview(String query, int start) {
        try {
            String url = String.format(
                    "%s/ItemSearch.aspx?ttbkey=%s&Query=%s&QueryType=Keyword&SearchTarget=Book&MaxResults=20&Start=%d&OptResult=bookinfo&output=js",
                    baseUrl, ttbKey, query, start
            );

            String raw = restTemplate.getForObject(url, String.class);
            String clean = StringEscapeUtils.unescapeHtml4(raw)
                    .replace("\\'", "'")
                    .replaceAll("[\\n\\r\\t]", " ")
                    .replaceAll("[\\u0000-\\u001F]", " ");

            JsonNode root = objectMapper.readTree(clean);
            JsonNode items = root.path("item");

            List<BookListResponseDto> result = new ArrayList<>();

            // ✅ 특수문자 제거 후 소문자로 통일
            String[] tokens = query
                    .replaceAll("[,\\.\\-\\+\"'!@#$%^&*()\\[\\]{}]", " ")  // 쉼표 등 제거
                    .toLowerCase()
                    .trim()
                    .split("\\s+");

            for (JsonNode it : items) {
                String title = it.path("title").asText("").toLowerCase();
                String author = it.path("author").asText("").toLowerCase();
                String publisher = it.path("publisher").asText("").toLowerCase();

                // ✅ 모든 토큰이 최소 한 필드에 포함될 경우만 포함
                boolean allMatch = true;
                for (String token : tokens) {
                    if (!(title.contains(token) || author.contains(token) || publisher.contains(token))) {
                        allMatch = false;
                        break;
                    }
                }

                if (allMatch) {
                    result.add(BookListResponseDto.from(it));
                }
            }

            // ✅ 정렬: 제목 시작 → 제목 포함 → 저자 → 출판사 기준으로 점수화
            result.sort((a, b) -> {
                int aScore = getRelevanceScore(a, tokens);
                int bScore = getRelevanceScore(b, tokens);
                return Integer.compare(bScore, aScore);
            });

            return BookListTotalResponseDto.builder()
                    .total(result.size())
                    .books(result)
                    .build();

        } catch (Exception e) {
            System.out.println("❌ 검색 목록 API 실패: " + e.getMessage());
            return BookListTotalResponseDto.builder()
                    .total(0)
                    .books(new ArrayList<>())
                    .build();
        }
    }

    // ✅ 관련성 점수 계산 메서드
    private int getRelevanceScore(BookListResponseDto book, String[] tokens) {
        int score = 0;
        String title = safeLower(book.getTitle());
        String author = safeLower(book.getAuthor());
        String publisher = safeLower(book.getPublisher());

        for (String token : tokens) {
            if (title.startsWith(token)) score += 10;
            else if (title.contains(token)) score += 6;
            if (author.contains(token)) score += 2;
            if (publisher.contains(token)) score += 1;
        }

        return score;
    }

    private String safeLower(String s) {
        return s == null ? "" : s.toLowerCase();
    }

    public BookResponseDto searchByIsbn13(String isbn13) {
        try {
            String url = String.format(
                    "%s/ItemLookUp.aspx?ttbkey=%s&ItemIdType=ISBN13&ItemId=%s&output=js&OptResult=bookinfo",
                    baseUrl, ttbKey, isbn13
            );

            String raw = restTemplate.getForObject(url, String.class);
            String clean = StringEscapeUtils.unescapeHtml4(raw)
                    .replace("\\'", "'")
                    .replaceAll("[\\n\\r\\t]", " ")
                    .replaceAll("[\\u0000-\\u001F]", " ");

            JsonNode root = objectMapper.readTree(clean);
            JsonNode item = root.path("item");
            if (item.isArray() && item.size() > 0) {
                return BookResponseDto.fromAladin(item.get(0));
            }

            return BookResponseDto.builder().isbn13(isbn13).build(); // fallback

        } catch (Exception e) {
            System.out.println("❌ ISBN13 검색 실패: " + e.getMessage());
            return BookResponseDto.builder().isbn13(isbn13).build();
        }
    }

    public BookResponseDto searchByItemIdToDto(Long itemId) {
        try {
            JsonNode node = this.searchByItemId(itemId);
            JsonNode item = node.path("item");
            if (item.isArray() && item.size() > 0) {
                return BookResponseDto.fromAladin(item.get(0));
            }
        } catch (Exception e) {
            System.out.println("❌ ItemId 기반 BookResponseDto 변환 실패: " + e.getMessage());
        }
        return BookResponseDto.builder().build();
    }

}
