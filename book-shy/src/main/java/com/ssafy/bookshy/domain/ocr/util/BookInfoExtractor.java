package com.ssafy.bookshy.domain.ocr.util;

import com.ssafy.bookshy.domain.ocr.dto.BookOcrDto;
import com.ssafy.bookshy.domain.ocr.dto.OcrField;

import java.util.*;
import java.util.stream.Collectors;

public class BookInfoExtractor {

    /* ── 내부 클래스 ───────────────────────── */
    private static class LineInfo {
        String text;
        int avgHeight;
        int y;
        int x;               // 왼쪽 글자의 x (세로쓰기 판별용)

        LineInfo(String t, int h, int y, int x) {
            this.text = t; this.avgHeight = h; this.y = y; this.x = x;
        }
    }

    /* ── 퍼블릭 엔트리포인트 ───────────────── */
    public static BookOcrDto extract(List<OcrField> fields) {
        Map<Integer, List<OcrField>> grouped = groupByLine(fields, 20);

        List<LineInfo> lines = grouped.values().stream()
                .map(fs -> new LineInfo(
                        fs.stream().map(OcrField::getText).collect(Collectors.joining(" ")),
                        (int) fs.stream().mapToInt(OcrField::getH).average().orElse(0),
                        fs.get(0).getY(),
                        fs.get(0).getX()))
                .sorted(Comparator.comparingInt(l -> l.y))
                .toList();

        return new BookOcrDto(
                pickTitle(lines),
                pickAuthor(lines, fields),
                pickTranslator(lines, fields),
                pickPublisher(lines)
        );
    }

    /* ── 줄 그룹핑 (y 좌표 기준) ─────────────── */
    private static Map<Integer, List<OcrField>> groupByLine(List<OcrField> f, int th) {
        f.sort(Comparator.comparingInt(OcrField::getY));
        Map<Integer, List<OcrField>> map = new LinkedHashMap<>();
        int key = 0, lastY = -9999;
        for (OcrField v : f) {
            if (Math.abs(v.getY() - lastY) > th) key = v.getY();
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(v);
            lastY = v.getY();
        }
        return map;
    }

    /* ── 제목 ──────────────────────────────── */
    private static String pickTitle(List<LineInfo> lns) {
        if (lns.isEmpty()) return "";
        int maxH = lns.stream().mapToInt(l -> l.avgHeight).max().orElse(0);

        List<LineInfo> big = lns.stream()
                .filter(l -> l.avgHeight >= maxH * 0.8)
                .sorted(Comparator.comparingInt(l -> l.y))
                .toList();

        List<LineInfo> kor = big.stream()
                .filter(l -> l.text.matches(".*[가-힣].*"))
                .toList();

        List<LineInfo> target = kor.isEmpty() ? big : kor;

        String joined = target.stream()
                .map(l -> l.text.replaceAll("[^가-힣A-Za-z0-9,· ]", "").trim())
                .collect(Collectors.joining(" "))
                .replaceAll("\\s{2,}", " ")
                .trim();

        return joined.length() > 30 ? joined.substring(0, 30).trim() : joined;
    }

    /* ── 저자 (가로 + 세로쓰기 둘 다) ─────────── */
    private static String pickAuthor(List<LineInfo> lines, List<OcrField> fields) {
        // 1) 가로줄 우선
        for (int i = 0; i < lines.size(); i++) {
            String t = lines.get(i).text;
            if (t.matches(".*(지음|저자|글).*")) {
                return cleanAuthorText(t);
            }
            if (t.trim().equals("지음") && i > 0)
                return cleanAuthorText(lines.get(i - 1).text + " 지음");
        }

        // 2) 세로쓰기 : 같은 X 좌표 ±10 내에 한글 1자씩인 경우
        Map<Integer, StringBuilder> cols = new TreeMap<>();
        for (OcrField f : fields) {
            if (f.getText().matches("[가-힣]")) {
                int key = (f.getX() / 10) * 10;     // 10px 그리드
                cols.computeIfAbsent(key, k -> new StringBuilder()).append(f.getText());
            }
        }
        // 가장 글자 수 많은 열을 후보로
        String vertical = cols.values().stream()
                .map(StringBuilder::toString)
                .max(Comparator.comparingInt(String::length))
                .orElse("");
        return vertical.length() >= 2 ? vertical : "";
    }

    private static String cleanAuthorText(String raw) {
        String cleaned = raw.replaceAll("(지음|저자|글)", "")
                .replaceAll("박사[의]?", "")
                .replaceAll("(명저|명성|떨친)", "")
                .trim();
        String[] tok = cleaned.split("\\s+");
        return String.join(" ", Arrays.copyOf(tok, Math.min(tok.length, 3))).trim();
    }

    /* ── 역자 (가로 + 세로쓰기) ──────────────── */
    private static String pickTranslator(List<LineInfo> lines, List<OcrField> fields) {
        for (int i = 0; i < lines.size(); i++) {
            String t = lines.get(i).text;
            if (t.matches(".*(옮김|번역|\\b역\\b).*"))
                return t.replaceAll("(옮김|번역|\\b역\\b)", "")
                        .replaceAll("[/|]", " ")
                        .replaceAll("\\s{2,}", " ")
                        .trim();
            if (t.trim().equals("옮김") && i > 0)
                return lines.get(i - 1).text.trim();
        }
        // 세로쓰기 역자 (예: “번역” 세로줄)
        Map<Integer, StringBuilder> col = new TreeMap<>();
        for (OcrField f : fields) {
            if (f.getText().matches("[가-힣]")) {
                int key = (f.getX() / 10) * 10;
                col.computeIfAbsent(key, k -> new StringBuilder()).append(f.getText());
            }
        }
        String v = col.values().stream()
                .map(StringBuilder::toString)
                .filter(s -> s.length() >= 2 && !s.equals("옮김"))
                .findFirst().orElse("");
        return v;
    }

    /* ── 출판사 ─────────────────────────────── */
    private static String pickPublisher(List<LineInfo> lines) {
        for (int i = lines.size() - 1; i >= 0; i--) {
            String pure = lines.get(i).text.replaceAll("[^가-힣]", "");
            if (pure.matches(".*(출판사|출판|사)$"))
                return lines.get(i).text.trim();
        }
        return "";
    }
}
