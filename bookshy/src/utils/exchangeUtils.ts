// src/utils/exchangeUtils.ts

/**
 * 교환 횟수에 따른 메시지를 반환합니다.
 * @param exchangeCount 총 교환 횟수
 * @param peopleCount 교환한 사람 수
 * @returns 교환 관련 메시지
 */
export const getExchangeMessage = (exchangeCount: number, peopleCount: number): string => {
  // 교환 경험이 없는 경우
  if (exchangeCount === 0) {
    return '첫 번째 책 교환으로 새로운 독서 경험을 시작해보세요!';
  }

  // 교환 횟수가 많은 경우
  if (exchangeCount >= 20) {
    return '활발한 책 교환을 통해 다양한 독서 경험을 쌓고 계시네요!';
  }

  // 많은 사람과 교환한 경우
  if (peopleCount >= 10) {
    return '다양한 사람들과 책을 교환하며 폭넓은 네트워크를 형성하고 있어요!';
  }

  // 일반적인 경우
  if (exchangeCount > peopleCount * 2) {
    return '특정 사람들과 지속적인 교환을 통해 깊은 독서 관계를 맺고 있군요!';
  } else {
    return '책 교환을 통해 새로운 독서 경험과 인연을 만들어가고 있어요!';
  }
};

/**
 * 마지막 교환 날짜에 따른 메시지를 반환합니다.
 * @param lastExchangeDate 마지막 교환 날짜 (ISO 문자열)
 * @returns 마지막 교환 관련 메시지
 */
export const getLastExchangeMessage = (lastExchangeDate?: string): string => {
  if (!lastExchangeDate) {
    return '';
  }

  const now = new Date();
  const lastDate = new Date(lastExchangeDate);
  const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 7) {
    return '최근에도 활발히 교환하고 계시네요!';
  } else if (diffDays < 30) {
    return '한 달 안에 책 교환을 하셨군요!';
  } else if (diffDays < 90) {
    return '3개월 내에 책 교환 활동이 있었어요.';
  } else {
    return '새로운 책 교환으로 독서 경험을 확장해보세요!';
  }
};
