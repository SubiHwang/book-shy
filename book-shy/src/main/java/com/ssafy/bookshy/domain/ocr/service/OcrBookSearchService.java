package com.ssafy.bookshy.domain.ocr.service;

import com.ssafy.bookshy.domain.ocr.dto.OcrField;
import com.ssafy.bookshy.domain.ocr.util.BookInfoExtractor;
import com.ssafy.bookshy.domain.ocr.dto.BookOcrDto;
import com.ssafy.bookshy.domain.book.dto.BookResponseDto;
import com.ssafy.bookshy.external.aladin.AladinClient;
import lombok.RequiredArgsConstructor;
import org.apache.commons.text.similarity.LevenshteinDistance;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Comparator;
import java.util.List;

@Profile("!prod")
@Service
@RequiredArgsConstructor
public class OcrBookSearchService {

    private final NaverCLOVAOcrService clova;
    private final AladinClient aladin;

    public BookResponseDto search(MultipartFile image) throws Exception {

        // 1) OCR 추출 및 후처리
        List<OcrField> fields = clova.extractFields(image);
        BookOcrDto ocr = BookInfoExtractor.extract(fields);

        System.out.println("📘 OCR 추출 결과: " + ocr);

        // 1차 쿼리: 제목 + 저자
        String query = ocr.getTitle().trim();
        if (!ocr.getAuthor().isBlank()) query += " " + ocr.getAuthor().trim();
        System.out.println("📘 알라딘 검색 쿼리: " + query);

        List<BookResponseDto> candidates = aladin.searchByKeyword(query);
        System.out.println("📘 알라딘 후보 수: " + candidates.size());

        // fallback: 제목만 재검색
        if (candidates.isEmpty() && !ocr.getTitle().isBlank()) {
            candidates = aladin.searchByKeyword(ocr.getTitle().trim());
            System.out.println("📘 fallback 검색으로 다시 시도 (title만)");
        }

        LevenshteinDistance dist = LevenshteinDistance.getDefaultInstance();
        return candidates.stream()
                .min(Comparator.comparingInt(b ->
                        dist.apply(normalize(b.getTitle()), normalize(ocr.getTitle()))))
                .orElse(null);
    }

    private String normalize(String s) {
        return s == null ? "" : s.replaceAll("[^가-힣A-Za-z0-9]", "").toLowerCase();
    }
}
