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

    public JsonNode searchByItemId(Long itemId) {
        try {
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
        } catch (Exception e) {
            throw new AladinException(AladinErrorCode.API_CALL_FAILED);
        }
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

            throw new AladinException(AladinErrorCode.ITEM_NOT_FOUND);

        } catch (AladinException ae) {
            throw ae;
        } catch (Exception e) {
            throw new AladinException(AladinErrorCode.API_CALL_FAILED);
        }
    }

    public BookResponseDto searchByItemIdToDto(Long itemId) {
        try {
            JsonNode node = this.searchByItemId(itemId);
            JsonNode itemArray = node.path("item");
            if (itemArray.isArray() && itemArray.size() > 0) {
                return BookResponseDto.fromAladin(itemArray.get(0));
            }
            throw new AladinException(AladinErrorCode.ITEM_NOT_FOUND);
        } catch (AladinException ae) {
            throw ae;
        } catch (Exception e) {
            throw new AladinException(AladinErrorCode.API_CALL_FAILED);
        }
    }

    public List<BookResponseDto> searchByKeyword(String query) {
        if (query == null || query.trim().isEmpty()) {
            throw new AladinException(AladinErrorCode.INVALID_QUERY);
        }

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

            if (list.isEmpty()) {
                throw new AladinException(AladinErrorCode.NO_SEARCH_RESULT);
            }

            return list;

        } catch (AladinException ae) {
            throw ae;
        } catch (Exception e) {
            throw new AladinException(AladinErrorCode.API_CALL_FAILED);
        }
    }

    public BookListTotalResponseDto searchListPreview(String query, int start) {
        if (query == null || query.trim().isEmpty()) {
            throw new AladinException(AladinErrorCode.INVALID_QUERY);
        }

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

        } catch (AladinException ae) {
            throw ae;
        } catch (Exception e) {
            throw new AladinException(AladinErrorCode.API_CALL_FAILED);
        }
    }

    public List<BookListResponseDto> searchListAuthor(String query, int start) {
        if (query == null || query.trim().isEmpty()) {
            throw new AladinException(AladinErrorCode.INVALID_QUERY);
        }

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

            return result;

        } catch (AladinException ae) {
            throw ae;
        } catch (Exception e) {
            throw new AladinException(AladinErrorCode.API_CALL_FAILED);
        }
    }

    public List<BookResponseDto> getRecommendationsByCategory(String category, int count) {
        if (count <= 0) {
            count = 3;
        }

        try {
            String url = String.format(
                    "%s/ItemSearch.aspx?ttbkey=%s&Query=%s&QueryType=Keyword&SearchTarget=Book&MaxResults=%d&Start=1&Sort=SalesPoint&output=js&OptResult=bookinfo",
                    baseUrl, ttbKey, category, Math.min(count * 2, 50)
            );

            String raw = restTemplate.getForObject(url, String.class);
            String clean = preprocessResponse(raw);

            JsonNode root = objectMapper.readTree(clean);
            JsonNode items = root.path("item");

            List<BookResponseDto> recommendedBooks = new ArrayList<>();

            if (items.isArray() && items.size() > 0) {
                for (JsonNode item : items) {
                    BookResponseDto book = BookResponseDto.fromAladin(item);
                    if (book.getIsbn13() != null && !book.getIsbn13().isEmpty()) {
                        recommendedBooks.add(book);
                        if (recommendedBooks.size() >= count) break;
                    }
                }
            }

            return recommendedBooks;

        } catch (AladinException ae) {
            throw ae;
        } catch (Exception e) {
            throw new AladinException(AladinErrorCode.API_CALL_FAILED);
        }
    }

    public List<BookResponseDto> getBestSellerRecommendations(int count) {
        try {
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
                if (recommendedBooks.size() >= count) break;
            }

            return recommendedBooks;

        } catch (AladinException ae) {
            throw ae;
        } catch (Exception e) {
            throw new AladinException(AladinErrorCode.API_CALL_FAILED);
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
