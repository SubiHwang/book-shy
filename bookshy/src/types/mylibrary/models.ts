// src/types/mylibrary/models.ts
// 데이터 모델 관련 타입들

export interface BookType {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  isbn?: string;
  isPublic: boolean;
  addedAt: Date;
  publisher?: string;
  description?: string;
  pageCount?: number;
}

// 필터링 옵션 타입
export type LibraryFilterType = 'all' | 'public';

// 정렬 옵션 타입
export type SortOption = 'title' | 'author' | 'addedDate' | 'readDate';
