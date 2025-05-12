package com.ssafy.bookshy.external.aladin;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.bookshy.domain.book.dto.BookListResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookListTotalResponseDto;
import com.ssafy.bookshy.domain.book.dto.BookResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AladinClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    @Value("${aladin.ttb.key}")
    private String ttbKey;
    @Value("${aladin.api.base-url}")
    private String baseUrl;

    public JsonNode searchByItemId(Long itemId) throws Exception {
        String url = UriComponentsBuilder
                .fromHttpUrl(baseUrl + "/ItemLookUp.aspx")
                .queryParam("ttbkey", ttbKey)
                .queryParam("ItemIdType", "ItemId")
                .queryParam("ItemId", itemId)
                .queryParam("OptResult", "bookinfo")
                .queryParam("output", "js")
                .toUriString();

        String raw = restTemplate.getForObject(url, String.class);
        String clean = preprocessResponse(raw);
        return objectMapper.readTree(clean);
    }


    public BookResponseDto searchByIsbn13(String isbn13) {
        try {
            String url = String.format(
                    "%s/ItemLookUp.aspx?ttbkey=%s&ItemIdType=ISBN13&ItemId=%s&OptResult=bookinfo&output=js",
                    baseUrl, ttbKey, isbn13
            );

            String raw = restTemplate.getForObject(url, String.class);
            String clean = preprocessResponse(raw);

            JsonNode root = objectMapper.readTree(clean);
            JsonNode itemArray = root.path("item");
            if (itemArray.isArray() && itemArray.size() > 0) {
                JsonNode item = itemArray.get(0);
                return BookResponseDto.fromAladin(item, false);
            }

            return BookResponseDto.builder().isbn13(isbn13).build();

        } catch (Exception e) {
            System.out.println("❌ ISBN13 검색 실패: " + e.getMessage());
            return BookResponseDto.builder().isbn13(isbn13).build();
        }
    }

    public BookResponseDto searchByItemIdToDto(Long itemId) {
        try {
            JsonNode node = this.searchByItemId(itemId);
            JsonNode itemArray = node.path("item");
            if (itemArray.isArray() && itemArray.size() > 0) {
                return BookResponseDto.fromAladin(itemArray.get(0));
            }
        } catch (Exception e) {
            System.out.println("❌ ItemId 기반 BookResponseDto 변환 실패: " + e.getMessage());
        }
        return BookResponseDto.builder().build();
    }

    public List<BookResponseDto> searchByKeyword(String query) {
        try {
            String url = String.format(
                    "%s/ItemSearch.aspx?ttbkey=%s&Query=%s&QueryType=Title&MaxResults=50&Sort=Accuracy&output=js",
                    baseUrl, ttbKey, query
            );

            String raw = restTemplate.getForObject(url, String.class);
            String clean = preprocessResponse(raw);

            JsonNode items = objectMapper.readTree(clean).path("item");
            List<BookResponseDto> list = new ArrayList<>();
            for (JsonNode it : items) {
                list.add(BookResponseDto.fromAladin(it));
            }

            return list;

        } catch (Exception e) {
            System.out.println("❌ 키워드 검색 실패: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    public BookListTotalResponseDto searchListPreview(String query, int start) {
        try {
            String url = String.format(
                    "%s/ItemSearch.aspx?ttbkey=%s&Query=%s&QueryType=Keyword&SearchTarget=Book&MaxResults=50&Start=%d&OptResult=bookinfo&Sort=Accuracy&output=js",
                    baseUrl, ttbKey, query, start
            );

            String raw = restTemplate.getForObject(url, String.class);
            String clean = preprocessResponse(raw);

            JsonNode root = objectMapper.readTree(clean);
            JsonNode items = root.path("item");
            List<BookListResponseDto> result = new ArrayList<>();

            String[] tokens = tokenizeQuery(query);
            for (JsonNode it : items) {
                String title = it.path("title").asText("").toLowerCase();
                String author = it.path("author").asText("").toLowerCase();
                String publisher = it.path("publisher").asText("").toLowerCase();

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


    private String preprocessResponse(String raw) {
        return StringEscapeUtils.unescapeHtml4(raw)
                .replace("\\'", "'")
                .replaceAll("[\\n\\r\\t]", " ")
                .replaceAll("[\\u0000-\\u001F]", " ");
    }

    private String[] tokenizeQuery(String query) {
        return query.replaceAll("[,\\.\\-\\+\"'!@#$%^&*()\\[\\]{}]", " ")
                .toLowerCase()
                .trim()
                .split("\\s+");
    }

    public List<BookListResponseDto> searchListAuthor(String query, int start) {
        try {
            log.info("작가 검색 시작 - 쿼리: {}, 시작 인덱스: {}", query, start);

            String url = String.format(
                    "%s/ItemSearch.aspx?ttbkey=%s&Query=%s&QueryType=Keyword&SearchTarget=Book&MaxResults=50&Start=%d&OptResult=bookinfo&Sort=Accuracy&output=js",
                    baseUrl, ttbKey, query, start
            );

            log.info("요청 URL: {}", url);

            String raw = restTemplate.getForObject(url, String.class);
            log.info("API 응답 길이: {}", raw != null ? raw.length() : "null");

            String clean = preprocessResponse(raw);
            log.info("전처리 후 응답 길이: {}", clean != null ? clean.length() : "null");

            JsonNode root = objectMapper.readTree(clean);
            JsonNode items = root.path("item");
            log.info("파싱된 아이템 수: {}", items.size());

            List<BookListResponseDto> result = new ArrayList<>();

            String[] tokens = tokenizeQuery(query);
            log.info("검색 토큰: {}", Arrays.toString(tokens));

            for (JsonNode it : items) {
                String title = it.path("title").asText("").toLowerCase();
                String author = it.path("author").asText("").toLowerCase();
                String publisher = it.path("publisher").asText("").toLowerCase();

                boolean allMatch = true;
                for (String token : tokens) {
                    if (!(title.contains(token) || author.contains(token) || publisher.contains(token))) {
                        allMatch = false;
                        break;
                    }
                }

                if (allMatch) {
                    log.debug("매칭된 책: 제목={}, 작가={}, 출판사={}", title, author, publisher);
                    result.add(BookListResponseDto.from(it));
                }
            }

            log.info("필터링 후 결과 수: {}", result.size());
            return result;

        } catch (Exception e) {
            log.error("❌ 검색 목록 API 실패", e);
            return new ArrayList<>();
        }
    }

    /**
     * 카테고리를 기반으로 책을 추천하는 메소드
     * 특정 카테고리의 책 중에서 인기도순으로 정렬하여 지정된 개수만큼 반환해
     *
     * @param category 책 카테고리 (예: 소설, 경제경영 등)
     * @param count    추천받을 책 개수 (기본값 3)
     * @return 추천된 책 목록
     */
    public List<BookResponseDto> getRecommendationsByCategory(String category, int count) {
        // 기본값 설정 (count가 0 이하면 3으로 설정)
        if (count <= 0) {
            count = 3;
        }

        try {
            // 알라딘 API URL 구성 - 기존 AladinClient 패턴을 따라 구현
            String url = String.format(
                    "%s/ItemSearch.aspx?ttbkey=%s&Query=%s&QueryType=Keyword&SearchTarget=Book&MaxResults=%d&Start=1&Sort=SalesPoint&output=js&OptResult=bookinfo",
                    baseUrl, ttbKey, category, Math.min(count * 2, 50)
            );

            // API 호출 및 전처리
            String raw = restTemplate.getForObject(url, String.class);
            String clean = preprocessResponse(raw);

            // JSON 파싱
            JsonNode root = objectMapper.readTree(clean);
            JsonNode items = root.path("item");

            // 결과 저장할 리스트
            List<BookResponseDto> recommendedBooks = new ArrayList<>();

            // 책이 충분히 있는지 확인
            if (items.isArray() && items.size() > 0) {
                // 각 항목을 BookResponseDto로 변환하여 리스트에 추가
                for (JsonNode item : items) {
                    // 이미 추가되지 않은 책만 추가 (중복 방지)
                    BookResponseDto book = BookResponseDto.fromAladin(item);

                    // ISBN이 비어있지 않은 유효한 책만 추가
                    if (book.getIsbn13() != null && !book.getIsbn13().isEmpty()) {
                        recommendedBooks.add(book);

                        // 요청한 개수만큼 모았으면 중단
                        if (recommendedBooks.size() >= count) {
                            break;
                        }
                    }
                }
            }

            return recommendedBooks;

        } catch (Exception e) {
            System.out.println("❌ 카테고리 기반 추천 실패: " + e.getMessage());
            return new ArrayList<>(); // 오류 시 빈 리스트 반환
        }
    }

    /**
     * 베스트셀러 또는 신간 등 기본 추천 책 목록을 가져오는 메소드
     *
     * @param count 추천받을 책 개수
     * @return 추천된 책 목록
     */
    public List<BookResponseDto> getBestSellerRecommendations(int count) {
        try {
            // 베스트셀러 API 호출
            String url = String.format(
                    "%s/ItemList.aspx?ttbkey=%s&QueryType=Bestseller&MaxResults=%d&SearchTarget=Book&output=js&OptResult=bookinfo",
                    baseUrl, ttbKey, count
            );

            String raw = restTemplate.getForObject(url, String.class);
            String clean = preprocessResponse(raw);

            JsonNode root = objectMapper.readTree(clean);
            JsonNode items = root.path("item");

            List<BookResponseDto> recommendedBooks = new ArrayList<>();

            for (JsonNode item : items) {
                BookResponseDto book = BookResponseDto.fromAladin(item);
                recommendedBooks.add(book);

                // 요청한 개수만큼 모았으면 중단
                if (recommendedBooks.size() >= count) {
                    break;
                }
            }

            return recommendedBooks;

        } catch (Exception e) {
            System.out.println("❌ 베스트셀러 추천 실패: " + e.getMessage());
            return new ArrayList<>();
        }
    }


}
