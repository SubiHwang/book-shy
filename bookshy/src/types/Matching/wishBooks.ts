import { WishBook } from '../book';

// @/types/Matching.ts

// @/types/Matching.ts

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  suggestions?: string[]; // 정적 제안 목록 (선택적)
  maxSuggestions?: number; // 최대 표시할 제안 수
  minQueryLength?: number; // 자동완성 시작을 위한 최소 글자 수
  debounceMs?: number; // 디바운스 지연 시간(ms)
}
export interface SearchResultListProps {
  resultList: WishBook[];
  searchTerm: string;
  total: number;
  isLoading: boolean;
}

export interface WishBooksResponse {
  total: number;
  books: WishBook[];
}

export interface PopularSearchTermType {
  keyword: string;
  rank: number;
  trend: string;
}

export interface PopularSearchTermResponse {
  trendingKeywords: PopularSearchTermType[];
}

export interface BookSearchSuggestion {
  keyword: string;
  type: string;
}

export interface BookSearchSuggestionResponse {
  items: BookSearchSuggestion[];
}
