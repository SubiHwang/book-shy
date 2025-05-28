// src/utils/messageUtils.ts

/**
 * 메시지를 느낌표(!)를 기준으로 나누기
 * 여러 개의 문장으로 나눠서 배열로 반환
 */
export const splitByExclamation = (message: string): string[] => {
  if (!message) return [];

  // 느낌표로 분리하되, 느낌표는 유지
  const parts = message.split(/(?<=!)/);

  // 빈 문자열 제거 및 앞뒤 공백 제거
  return parts.map((part) => part.trim()).filter((part) => part.length > 0);
};

/**
 * 메시지를 여러 줄로 포맷팅
 * 느낌표(!)를 기준으로 줄바꿈 추가
 */
export const formatMultilineMessage = (message: string): string => {
  if (!message) return '';

  const sentences = splitByExclamation(message);

  // 문장들을 줄바꿈으로 연결
  return sentences.join('\n');
};

// 기존 함수들은 그대로 유지...
export const extractEmoji = (text: string): string => {
  const emojiRegex = /[\p{Emoji}\u200d]+/u;
  const match = text.match(emojiRegex);
  return match ? match[0] : '';
};

/**
 * 메시지를 두 부분으로 나누기 (첫 번째 문장과 나머지)
 */
export const splitMessage = (message: string): { mainMessage: string; subMessage: string } => {
  // 첫 번째 !, ., ? 중 먼저 나오는 것을 기준으로 분리
  const splitIndex = Math.max(message.indexOf('!'), message.indexOf('.'), message.indexOf('?'));

  if (splitIndex > 0) {
    const mainMessage = message.slice(0, splitIndex + 1).trim();
    const subMessage = message.slice(splitIndex + 1).trim();
    return { mainMessage, subMessage };
  }

  return { mainMessage: message, subMessage: '' };
};

/**
 * 기본 독서량 메시지 생성 (데이터가 없는 경우)
 */
export const getDefaultReadingMessage = (count: number): string => {
  if (count <= 0) {
    return '📖 이제 막 시작했어요! 오늘 한 장부터 열어볼까요?';
  } else if (count < 5) {
    return `📚 ${count}권의 독서 여정이 시작되었어요! 더 많은 책과 함께해요.`;
  }
  return `📚 ${count}권을 읽으셨네요! 독서 여정이 궁금해요.`;
};

/**
 * 기본 장르 메시지 생성 (데이터가 없는 경우)
 */
export const getDefaultGenreMessage = (genre: string = ''): string => {
  if (!genre || genre === '정보 없음') {
    return '📚 도서를 추가하시면 선호 장르를 분석해 드립니다.';
  }
  return `📚 ${genre} 장르를 좋아하시는군요!`;
};
