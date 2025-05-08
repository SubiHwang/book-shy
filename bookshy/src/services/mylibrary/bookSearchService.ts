// src/services/mylibrary/bookSearchService.ts
import { authAxiosInstance } from '@/services/axiosInstance';
import type { BookSearchResponse } from '@/types/mylibrary/bookSearch';

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

// 알라딘 아이템 ID로 책 등록 API
export const registerBookByItemId = async (
  userId: number,
  itemId: number,
  isPublic: boolean = false,
): Promise<any> => {
  try {
    console.log(`알라딘 책 등록 요청: userId=${userId}, itemId=${itemId}, isPublic=${isPublic}`);

    // API 호출
    const response = await authAxiosInstance.post(
      `/library/item?userId=${userId}&itemId=${itemId}&isPublic=${isPublic}`,
    );

    console.log('알라딘 책 등록 성공:', response);
    return response;
  } catch (error) {
    console.error('알라딘 책 등록 오류:', error);
    throw error;
  }
};
