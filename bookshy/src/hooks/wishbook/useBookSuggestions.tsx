// src/hooks/useBookSuggestions.ts
import { useQuery } from '@tanstack/react-query';
import { getBookSuggestions } from '@/services/matching/wishbooks';
import { useState, useEffect } from 'react';

export const useBookSuggestions = (query: string, debounceMs = 350) => {
  // 디바운스된 쿼리 상태 추가
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  
  // 디바운스 적용
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);
    
    return () => clearTimeout(timer);
  }, [query, debounceMs]);
  
  // 디바운스된 쿼리로 API 호출
  return useQuery({
    queryKey: ['bookSuggestions', debouncedQuery],
    queryFn: () => getBookSuggestions(debouncedQuery),
    enabled: debouncedQuery.length >= 2, // 2글자 이상 입력 시 쿼리 활성화
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    placeholderData: (previousData) => previousData, // 이전 데이터 유지하여 UI 깜빡임 방지
    refetchOnWindowFocus: false, // 불필요한 재요청 방지
    retry: false, // 실패 시 재시도 안 함
  });
};