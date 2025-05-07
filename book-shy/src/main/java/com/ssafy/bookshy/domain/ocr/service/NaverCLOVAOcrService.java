package com.ssafy.bookshy.domain.ocr.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.bookshy.domain.ocr.dto.OcrField;
import lombok.RequiredArgsConstructor;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.HttpHeaders;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Profile("!prod")
@Service
@RequiredArgsConstructor
public class NaverCLOVAOcrService {

    @Value("${naver.ocr.secretKey}")
    private String secretKey;

    @Value("${naver.ocr.url}")
    private String apiUrl;

    /** 글자·좌표 전체를 반환 */
    public List<OcrField> extractFields(MultipartFile image) throws IOException {
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpPost post = new HttpPost(apiUrl);
            post.setHeader("X-OCR-SECRET", secretKey);
            post.setHeader(HttpHeaders.CONTENT_TYPE, "application/json");

            String body = """
                {
                  "version": "V2",
                  "requestId": "%s",
                  "timestamp": %d,
                  "images": [
                    {
                      "name": "ocr_image",
                      "format": "jpg",
                      "data": "%s"
                    }
                  ]
                }
                """.formatted(
                    UUID.randomUUID(),
                    System.currentTimeMillis(),
                    Base64.getEncoder().encodeToString(image.getBytes())
            );
            post.setEntity(new StringEntity(body));

            JsonNode root = new ObjectMapper()
                    .readTree(client.execute(post).getEntity().getContent());

            JsonNode fields = root.get("images").get(0).get("fields");
            List<OcrField> list = new ArrayList<>();

            for (JsonNode f : fields) {
                String text = f.get("inferText").asText();

                // 좌표: 좌상단(0), 우상단(1), 우하단(2), 좌하단(3)
                JsonNode v0 = f.get("boundingPoly").get("vertices").get(0);
                JsonNode v2 = f.get("boundingPoly").get("vertices").get(2);

                int x = v0.get("x").asInt();
                int y = v0.get("y").asInt();
                int h = v2.get("y").asInt() - y;   // 높이 = 하단Y - 상단Y

                list.add(new OcrField(text, x, y, h));
            }
            return list;
        }
    }
}
