// src/utils/genreUtils.ts

/**
 * 장르에 따른 설명을 반환합니다.
 * @param genre 선호 장르
 * @returns 장르 설명 메시지
 */
export const getGenreDescription = (genre: string): string => {
  const descriptions: Record<string, string> = {
    소설: '이야기 속에서 다양한 감정과 인생을 경험하는 것을 즐기시는군요!',
    자기계발: '자신의 성장과 발전에 관심이 많으신 분이시네요!',
    역사: '과거의 지혜를 통해 현재와 미래를 바라보는 통찰력을 기르고 계세요!',
    과학: '세상의 원리와 탐구에 호기심이 많으신 분이시군요!',
    '경제/경영': '실용적인 지식과 성공 전략에 관심이 많으신 분이시네요!',
    인문학: '깊이 있는 사색과 철학적 통찰을 추구하시는 지적 탐험가시군요!',
    예술: '아름다움과 창의성에 대한 감각이 뛰어나신 분이네요!',
    종교: '영적인 성장과 내면의 평화를 추구하시는 분이시군요!',
    건강: '건강한 삶과 웰빙에 관심이 많으신 분이시네요!',
    취미: '다양한 활동과 즐거움을 통해 삶을 풍요롭게 하고 계세요!',
  };

  return descriptions[genre] || '다양한 장르를 탐색하며 폭넓은 지식과 경험을 쌓고 계시네요!';
};

/**
 * 장르 매칭률에 따른 메시지를 반환합니다.
 * @param matchingRate 장르 매칭률 (0-100)
 * @returns 매칭률 관련 메시지
 */
export const getMatchingRateMessage = (matchingRate: number): string => {
  if (matchingRate >= 90) {
    return '이 장르에 대한 애정이 매우 높으시네요!';
  } else if (matchingRate >= 70) {
    return '이 장르에 높은 관심을 보이고 계세요!';
  } else if (matchingRate >= 50) {
    return '이 장르를 꾸준히 탐색하고 계시네요!';
  } else if (matchingRate >= 30) {
    return '이 장르를 조금씩 탐색 중이신가요?';
  } else {
    return '새롭게 관심을 가지기 시작한 장르인가요?';
  }
};
