// src/types/mylibrary/components.ts
// 컴포넌트 props 타입들
import { BookType, LibraryFilterType } from './models';

export interface BookShelfProps {
  books: BookType[];
  isLoading: boolean;
}

export interface BookItemProps {
  book: BookType;
  onClick?: (book: BookType) => void;
}

export interface StatsCardProps {
  totalBooks: number;
  rank?: number;
  achievement?: string;
}

export interface LibraryTabsProps {
  activeTab: LibraryFilterType;
  onTabChange: (tab: LibraryFilterType) => void;
  allCount: number;
  publicCount: number;
}

export interface AddBookDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
