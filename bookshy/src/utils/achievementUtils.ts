// src/utils/achievementUtils.ts
// 읽은 책 수에 따라 다양한 업적 메시지를 생성하는 유틸리티 함수

/**
 * 읽은 책 수에 따라 적절한 업적 메시지를 반환합니다.
 * @param totalBooks 총 읽은 책 수
 * @returns 적절한 업적 메시지
 */
export const getAchievementMessage = (totalBooks: number): string => {
  // 읽은 책 수에 따라 다른 메시지 반환
  if (totalBooks >= 100) {
    return '축하합니다! 현재까지 건물 2층 높이 만큼 독서를 했어요!';
  } else if (totalBooks >= 50) {
    return '축하합니다! 현재까지 건물 1층 높이 만큼 독서를 했어요!';
  } else if (totalBooks >= 30) {
    return '축하합니다! 한 달에 한 권씩 꾸준히 읽고 계시네요!';
  } else if (totalBooks >= 10) {
    return '독서 습관이 점점 형성되고 있어요. 계속 이어가세요!';
  } else if (totalBooks >= 5) {
    return '독서 여정을 시작하셨군요! 좋은 출발입니다.';
  } else {
    return '첫 걸음을 시작했어요! 다음 책도 기대할게요.';
  }
};

/**
 * 사용자 랭킹에 따라 랭킹 관련 메시지를 반환합니다.
 * @param rank 사용자 랭킹
 * @param totalUsers 전체 사용자 수
 * @returns 랭킹 관련 메시지
 */
export const getRankingMessage = (rank: number, totalUsers: number = 100): string => {
  const percentile = Math.floor((rank / totalUsers) * 100);

  if (rank === 1) {
    return '전체 1등 독서 왕이 되었어요!';
  } else if (rank <= 3) {
    return `상위 3%의 독서가입니다!`;
  } else if (rank <= 10) {
    return `상위 10%의 열정적인 독서가입니다!`;
  } else if (percentile <= 20) {
    return `상위 ${percentile}%의 독서량을 보여주고 있어요!`;
  } else {
    return `전체 ${rank}위를 달성했어요. 더 높은 순위를 노려보세요!`;
  }
};

/**
 * 복합적인 요소를 고려하여 사용자에게 가장 적합한 업적 메시지를 반환합니다.
 * @param totalBooks 총 읽은 책 수
 * @param rank 사용자 랭킹
 * @param recentActivity 최근 활동 여부
 * @returns 적합한 업적 메시지
 */
export const getBestAchievementMessage = (
  totalBooks: number,
  rank: number,
  recentActivity: boolean = true,
): string => {
  // 읽은 책 수가 많으면 그에 대한 메시지 우선
  if (totalBooks >= 50) {
    return getAchievementMessage(totalBooks);
  }

  // 랭킹이 높으면 랭킹 메시지 우선
  if (rank <= 10) {
    return getRankingMessage(rank);
  }

  // 최근 활동이 있으면 그에 관한 메시지
  if (recentActivity && totalBooks > 0) {
    return '최근에도 꾸준히 독서를 이어가고 계시네요!';
  }

  // 그 외에는 기본 책 수 메시지
  return getAchievementMessage(totalBooks);
};
