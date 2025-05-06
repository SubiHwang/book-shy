package com.ssafy.bookshy.domain.ocr.controller;

import com.ssafy.bookshy.domain.ocr.dto.BookOcrDto;
import com.ssafy.bookshy.domain.ocr.service.BarcodeService;
import com.ssafy.bookshy.domain.ocr.service.NaverCLOVAOcrService;
import com.ssafy.bookshy.domain.ocr.service.OcrIsbnExtractorService;
import com.ssafy.bookshy.domain.ocr.util.BookInfoExtractor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;

@Tag(name = "🔍 OCR API", description = "도서 표지·바코드 이미지에서 정보 추출")
@RestController
@RequestMapping("/api/ocr")
@RequiredArgsConstructor
public class OcrController {

    private final NaverCLOVAOcrService clova;
    private final BarcodeService barcode;
    private final OcrIsbnExtractorService isbnExtractor;

    @Operation(summary = "❌ 표지 → 제목·저자·역자·출판사 [Test]")
    @PostMapping(value = "/text", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BookOcrDto extractBookInfo(@RequestPart("image") MultipartFile image) throws Exception {
        return BookInfoExtractor.extract(clova.extractFields(image));
    }

    @Operation(summary = "❌ 바코드 → ISBN [Test]")
    @PostMapping(value = "/isbn", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> extractIsbn(@RequestPart("image") MultipartFile image) throws Exception {
        return Map.of("isbn", barcode.extractIsbn(image));
    }

    @Operation(summary = "❌ OCR 기반 ISBN 추출 (텍스트 기반) [Test]")
    @PostMapping(value = "/isbn-ocr", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> extractIsbnFromText(@RequestPart("image") MultipartFile image) throws Exception {
        String isbn = isbnExtractor.extractIsbnFromText(image);
        return Map.of("isbn", isbn);
    }
}
