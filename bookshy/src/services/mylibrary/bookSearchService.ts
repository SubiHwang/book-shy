// src/services/mylibrary/bookSearchService.ts
import { authAxiosInstance } from '@/services/axiosInstance';
import type { BookSearchResponse } from '@/types/mylibrary/bookSearch';
import type { Library } from '@/types/mylibrary/library';

// 책 검색 API 함수
export const searchBooksByKeyword = async (keyword: string): Promise<BookSearchResponse> => {
  try {
    console.log(`책 검색 요청: 키워드 = ${keyword}`);

    // 키워드 URL 인코딩
    const encodedKeyword = encodeURIComponent(keyword);

    // API 호출
    const response = await authAxiosInstance.get<BookSearchResponse>(
      `/book/search/list?q=${encodedKeyword}`,
    );

    console.log('책 검색 성공:', response);
    return response as unknown as BookSearchResponse;
  } catch (error) {
    console.error('책 검색 오류:', error);
    throw error;
  }
};

export const addBookFromSearch = async (itemId: number): Promise<Library> => {
  try {
    console.log(`검색 결과 책 등록 요청:itemId=${itemId}`);

    // API 호출
    const response = await authAxiosInstance.post<Library>(`/library/search/add?itemId=${itemId}`);

    console.log('검색 결과 책 등록 성공:', response);
    return response as unknown as Library;
  } catch (error) {
    console.error('검색 결과 책 등록 오류:', error);
    throw error;
  }
};
