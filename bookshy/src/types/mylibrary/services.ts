// src/types/mylibrary/services.ts
// API 서비스 관련 타입들
import { BookType, LibraryFilterType, SortOption } from './models';

export interface BookSearchResult {
  books: BookType[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface BookSearchParams {
  query?: string;
  filter?: LibraryFilterType;
  page?: number;
  limit?: number;
  sort?: SortOption;
}
