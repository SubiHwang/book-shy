// src/utils/achievementUtils.ts
// 읽은 책 수에 따라 다양한 업적 메시지를 생성하는 유틸리티 함수

/**
 * 읽은 책 수에 따라 적절한 높이 기반 업적 메시지를 반환합니다.
 * @param totalBooks 총 읽은 책 수
 * @returns 적절한 업적 메시지
 */
export const getHeightAchievementMessage = (totalBooks: number): string => {
  // 초기 단계
  if (totalBooks >= 5 && totalBooks < 10) {
    return '축하합니다! 와인병 높이만큼 책을 읽으셨네요! (약 12.5cm)';
  } else if (totalBooks >= 10 && totalBooks < 15) {
    return '잘 하고 계세요! 작은 캐리어 가방 높이만큼 지식이 쌓였어요! (약 25cm)';
  } else if (totalBooks >= 15 && totalBooks < 20) {
    return '꾸준히 읽고 계시네요! 작은 강아지 높이만큼 읽었어요! (약 37.5cm)';
  }
  // 중간 단계
  else if (totalBooks >= 20 && totalBooks < 30) {
    return '대단해요! 의자 높이만큼 책을 읽으셨어요! (약 50cm)';
  } else if (totalBooks >= 30 && totalBooks < 40) {
    return '열정적인 독서가! 식탁 높이까지 쌓았어요! (약 75cm)';
  } else if (totalBooks >= 40 && totalBooks < 50) {
    return '지식이 늘고 있어요! 성인 허리 높이만큼 책을 읽었어요! (약 1m)';
  }
  // 고급 단계
  else if (totalBooks >= 50 && totalBooks < 60) {
    return '독서의 중간 지점! 세탁기 높이만큼 읽었어요! (약 1.25m)';
  } else if (totalBooks >= 60 && totalBooks < 70) {
    return '꾸준한 독서가 습관이 되고 있어요! 성인 어깨 높이만큼 읽었어요! (약 1.5m)';
  } else if (totalBooks >= 70 && totalBooks < 80) {
    return '독서 고수의 길! 냉장고의 거의 대부분 높이만큼 읽었어요! (약 1.75m)';
  }
  // 전문가 단계
  else if (totalBooks >= 80 && totalBooks < 90) {
    return '놀라워요! 일반 문 높이만큼 책을 읽으셨어요! (약 2m)';
  } else if (totalBooks >= 90 && totalBooks < 100) {
    return '독서 마라토너! 탁구대 길이만큼 책을 쌓았어요! (약 2.25m)';
  } else if (totalBooks >= 100 && totalBooks < 150) {
    return '축하합니다! 건물 1층 높이만큼 독서를 달성했어요! (약 2.5m)';
  } else if (totalBooks >= 150 && totalBooks < 200) {
    return '독서 마스터! 가로등 높이만큼 책을 읽었어요! (약 3.75m)';
  } else if (totalBooks >= 200) {
    return '독서의 신! 건물 2층 높이만큼 책을 정복했어요! (약 5m)';
  } else {
    return '첫 걸음을 시작했어요! 다음 책도 기대할게요.';
  }
};

/**
 * 최근 활동에 따른 메시지를 반환합니다.
 * @param recentActivity 최근 활동 여부
 * @returns 최근 활동 관련 메시지
 */
export const getActivityMessage = (recentActivity: boolean): string => {
  if (recentActivity) {
    const messages = [
      '최근 독서 활동이 활발하네요! 계속 이어가세요!',
      '꾸준한 독서 습관이 형성되고 있어요!',
      '독서 습관이 만들어지고 있어요. 기대할게요!',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
  return '';
};

/**
 * 다음 업적까지 남은 책 수를 계산합니다.
 * @param totalBooks 총 읽은 책 수
 * @returns 다음 업적까지 남은 책 수와 다음 업적 정보
 */
export const getNextAchievement = (
  totalBooks: number,
): { booksNeeded: number; nextMilestone: number; nextAchievement: string } => {
  const milestones = [5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200];

  // 다음 업적 찾기
  let nextMilestone = 5; // 기본값

  for (const milestone of milestones) {
    if (totalBooks < milestone) {
      nextMilestone = milestone;
      break;
    }
  }

  // 이미 최고 업적을 달성한 경우
  if (totalBooks >= 200) {
    nextMilestone = Math.ceil(totalBooks / 50) * 50; // 다음 50의 배수로 설정
  }

  const booksNeeded = nextMilestone - totalBooks;
  const nextAchievement = getHeightAchievementMessage(nextMilestone);

  return {
    booksNeeded,
    nextMilestone,
    nextAchievement,
  };
};
