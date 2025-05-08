import { KeyboardEvent } from 'react';
import { WishBook } from '../book';

export interface SearchBarProps {
  onSearch: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export interface SearchResultListProps {
  resultList: WishBook[];
  searchTerm: string;
}
