// src/types/mylibrary/bookSearch.ts
export interface BookSearchItem {
  itemId: number;
  title: string;
  author: string;
  publisher: string;
  coverImageUrl: string;
  description: string;
  inLibrary: boolean;
}

export interface BookSearchResponse {
  total: number;
  books: BookSearchItem[];
}
