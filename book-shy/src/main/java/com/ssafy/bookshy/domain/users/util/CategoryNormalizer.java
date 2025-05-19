package com.ssafy.bookshy.domain.users.util;

import java.util.HashMap;
import java.util.Map;

public class CategoryNormalizer {

    private static final Map<String, String> CATEGORY_MAP = createCategoryMap();

    private static Map<String, String> createCategoryMap() {
        Map<String, String> map = new HashMap<>();
        map.put("소설", "문학");
        map.put("소설/시/희곡", "문학");
        map.put("시", "문학");
        map.put("희곡", "문학");
        map.put("에세이", "에세이");
        map.put("인문학", "인문학");
        map.put("사회과학", "사회과학");
        map.put("과학", "과학");
        map.put("경제경영", "경제");
        map.put("자기계발", "자기계발");
        map.put("전기/자서전", "전기/자서전");
        map.put("청소년", "청소년");
        map.put("초등학교참고서", "아동교육");
        map.put("어린이", "동화");
        map.put("유아", "동화");
        map.put("컴퓨터/모바일", "IT");
        map.put("예술/대중문화", "예술");
        map.put("건강/취미", "취미");
        map.put("요리/살림", "취미");
        map.put("종교/역학", "종교");
        map.put("잡지", "기타");
        map.put("만화", "만화");
        map.put("역사", "역사");
        map.put("여행", "여행");
        map.put("외국어", "외국어");
        map.put("전집/중고전집", "기타");
        return map;
    }

    public static String normalize(String rawCategory) {
        return CATEGORY_MAP.getOrDefault(rawCategory, "기타");
    }
}
