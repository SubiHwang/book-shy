// src/types/mylibrary/bookSearch.ts
export interface BookSearchItem {
  itemId: number;
  title: string;
  author: string;
  publisher: string;
  coverImageUrl: string;
  description: string;
}

export interface BookSearchResponse {
  total: number;
  books: BookSearchItem[];
}
