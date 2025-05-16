import { ReactNode } from 'react';

/**
 * 검색 결과에서 일치하는 부분을 하이라이트하는 유틸리티 함수
 * @param text 원본 텍스트
 * @param query 검색어
 * @returns 하이라이트된 ReactNode
 */
export const highlightMatch = (text: string, query: string): ReactNode => {
  // 검색어가 없거나 너무 짧으면 원본 텍스트 반환
  if (!query || query.length < 2) return text;
  
  // 특수문자 이스케이프 처리
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // 대소문자 구분 없이 전역 검색을 위한 정규식
  const regex = new RegExp(`(${safeQuery})`, 'gi');
  // 정규식에 따라 텍스트 분할
  const parts = text.split(regex);
  
  // 각 부분을 매핑하여 일치하는 부분은 하이라이트 처리
  return parts.map((part, i) => {
    // 대소문자 구분 없이 일치 여부 확인
    if (part.toLowerCase() === query.toLowerCase()) {
      return <span key={i} className="text-primary font-semibold">{part}</span>;
    }
    return part;
  });
};

export default highlightMatch;