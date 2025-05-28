// src/components/mylibrary/BookShelf/BannerCards/BooksBanner.tsx
import React from 'react';
import { BooksBannerData } from '@/types/mylibrary/components';
import BannerCard from './BannerCard';

interface BooksBannerProps {
  data: BooksBannerData;
}

const BooksBanner: React.FC<BooksBannerProps> = ({ data }) => {
  const { totalBooks, achievement } = data;

  // 메시지를 2줄로 최적화하기
  const formatMessageToTwoLines = (message: string): string => {
    if (!message) return '';

    // 이모지 추출
    const emojiMatch = message.match(/^[^\p{L}]+/u);
    const emoji = emojiMatch ? emojiMatch[0].trim() : '';

    // 이모지를 제외한 텍스트
    let textContent = message;
    if (emoji) {
      textContent = message.slice(emoji.length).trim();
    }

    // 괄호 부분 추출 (예: (약 1.5m))
    const bracketMatch = textContent.match(/\([^)]+\)/);
    const bracket = bracketMatch ? bracketMatch[0] : '';

    // 느낌표로 문장 분리
    const sentences = textContent.split(/(?<=!)/);

    // 첫 번째 문장 (이모지 포함)
    const firstLine = `${emoji} ${sentences[0]?.trim() || ''}`.trim();

    // 두 번째 문장 + 괄호
    let secondLine = '';
    if (sentences.length > 1) {
      // 괄호 부분을 뒤로 이동 (가능한 경우)
      const secondSentence = sentences[1].replace(bracketMatch ? bracketMatch[0] : '', '').trim();
      secondLine = `${secondSentence} ${bracket}`.trim();
    } else if (bracket) {
      secondLine = bracket;
    }

    // 두 줄 합치기
    return secondLine ? `${firstLine}\n${secondLine}` : firstLine;
  };

  // 기본 메시지 준비
  const defaultMessage = '📖 이제 막 시작했어요! 오늘 한 장부터 열어볼까요?';

  // 메시지 포맷팅
  const formattedDescription = formatMessageToTwoLines(achievement || defaultMessage);

  return (
    <BannerCard
      backgroundColor="bg-card-bg-pink"
      accentColor="text-primary"
      highlightedText={`${totalBooks}권`}
      description={formattedDescription}
      iconSrc="/icons/bookstats.svg"
      iconAlt="책 통계"
      preText="지금까지"
      postText="을 읽었어요." // 띄어쓰기 없이 그대로 사용
    />
  );
};

export default BooksBanner;
