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
                return BookResponseDto.fromAladin(itemArray.get(0));
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
}
