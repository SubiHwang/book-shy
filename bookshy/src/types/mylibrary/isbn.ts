//src/types/mylibrary/isbn.ts
export interface ISBNSearchResponse {
  title: string;
  author: string;
  publisher: string;
  coverImageUrl: string;
  description: string;
  pubDate: string;
  category: string;
  pageCount: number;
  isbn13: string;
}

/**
 * 서재에 책 추가 API 응답 인터페이스
 */
export interface AddBookResponse {
  libraryId: number;
  aladinItemId: number;
  isbn13: string;
  title: string;
  author: string;
  coverImageUrl: string;
  public: boolean;
}
