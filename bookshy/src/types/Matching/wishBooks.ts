import { KeyboardEvent } from 'react';
import { WishBook } from '../book';

export interface SearchBarProps {
  onSearch: (e: KeyboardEvent<HTMLInputElement>) => void;
  value: string;
  onChange: (value: string) => void;
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
