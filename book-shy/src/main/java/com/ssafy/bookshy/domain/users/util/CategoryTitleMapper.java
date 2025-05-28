package com.ssafy.bookshy.domain.users.util;

import java.util.HashMap;
import java.util.Map;

public class CategoryTitleMapper {

    private static final Map<String, String> CATEGORY_TITLE_MAP = createTitleMap();

    private static Map<String, String> createTitleMap() {
        Map<String, String> map = new HashMap<>();
        map.put("문학", "📖 감성 깊은 이야기꾼! 문학 마스터");
        map.put("동화", "🧸 동심 전문가! 동화 마스터");
        map.put("IT", "💻 디지털 탐험가! IT 독서가");
        map.put("인문학", "🧠 생각이 자라는 철학 독서가");
        map.put("에세이", "✍️ 감성 충전 완료! 에세이 애호가");
        map.put("만화", "📚 웃음 & 감동 컬렉터! 만화 마스터");
        map.put("취미", "🍳 라이프스타일 크리에이터");
        map.put("경제", "💸 실용 만렙! 경제 독서가");
        map.put("사회과학", "🏛️ 사회 통찰자! 사회과학 마스터");
        map.put("과학", "🔬 호기심 천국! 과학 탐험가");
        map.put("전기/자서전", "🧭 인생을 읽는 사람! 인물 독서가");
        map.put("종교", "✨ 마음을 읽는 사람! 믿음의 독서가");
        map.put("외국어", "🌍 언어 여행자! 글로벌 리더");
        map.put("청소년", "🧒 감수성 충만! 틴 독서가");
        map.put("역사", "📜 시간을 거슬러! 역사 탐험가");
        map.put("여행", "🧳 머릿속 지도에 책 한 권! 여행 독서가");
        map.put("아동교육", "🎒 똑똑한 길잡이! 학습 마스터");
        map.put("기타", "📚 뭐든 읽는 당신! 장르 불문 독서가");
        return map;
    }

    public static String getCategoryTitle(String normalizedCategory) {
        return CATEGORY_TITLE_MAP.getOrDefault(normalizedCategory, "📚 뭐든 읽는 당신! 장르 불문 독서가");
    }
}
