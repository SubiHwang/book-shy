package com.ssafy.bookshy.domain.ocr.service;

import com.ssafy.bookshy.domain.ocr.dto.OcrField;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class OcrIsbnExtractorService {

    private final NaverCLOVAOcrService clova;

    public String extractIsbnFromText(MultipartFile image) throws Exception {
        List<OcrField> fields = clova.extractFields(image);

        Pattern isbnPattern = Pattern.compile("(97[89][- ]?\\d{1,5}[- ]?\\d{1,7}[- ]?\\d{1,7}[- ]?\\d)");
        for (OcrField field : fields) {
            String text = field.getText().replaceAll("[^0-9Xx\\- ]", "");
            Matcher matcher = isbnPattern.matcher(text);
            if (matcher.find()) {
                return matcher.group().replaceAll("[- ]", ""); // 하이픈 제거
            }
        }
        return "";
    }
}
