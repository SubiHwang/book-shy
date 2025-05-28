// src/services/mylibrary/isbnresultService.ts
import { authAxiosInstance } from '@/services/axiosInstance';
import { ISBNSearchResponse } from '@/types/mylibrary/isbn';
import { Library } from '@/types/mylibrary/library';

// ISBN으로 책 정보 검색
export const fetchBookDetailsByISBN = async (isbn: string): Promise<ISBNSearchResponse> => {
  try {
    console.log(`API 호출 시작: /book/search/isbn?isbn13=${isbn}`);
    const response = await authAxiosInstance.get(`/book/search/isbn?isbn13=${isbn}`);
    console.log('전체 응답 객체:', response);
    console.log('응답 데이터 타입:', typeof response);
    console.log('응답 객체의 키들:', Object.keys(response));

    if (response && typeof response === 'object') {
      // 객체인 경우, 해당 객체가 직접 ISBNSearchResponse일 수 있음
      const bookData = response as unknown as ISBNSearchResponse;
      return bookData;
    }

    return response;
  } catch (error) {
    console.error('ISBN 검색 API 오류:', error);
    throw error;
  }
};

// ISBN으로 책 등록
export const registerBookByISBN = async (
  isbn13: string,
  isPublic: boolean = false,
): Promise<Library> => {
  try {
    console.log(`도서 등록 요청: isbn13=${isbn13}, isPublic=${isPublic}`);

    const response = await authAxiosInstance.post<Library>(
      `/library/isbn?isbn13=${isbn13}&isPublic=${isPublic}`,
    );

    console.log('도서 등록 성공:', response);
    return response as unknown as Library;
  } catch (error) {
    console.error('도서 등록 오류:', error);
    throw error;
  }
};
