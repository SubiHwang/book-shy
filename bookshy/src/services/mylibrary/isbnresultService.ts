//src/services/mylibrary/isbnresultService.ts
import { authAxiosInstance } from '@/services/axiosInstance';
import { ISBNSearchResponse } from '@/types/mylibrary/isbn';

/**
 * 책 정보 관련 API 서비스
 */
const bookAddService = {
  /**
   * ISBN으로 책 검색
   * @param isbn ISBN13 코드
   * @returns 검색된 책 정보
   */
  searchBookByISBN: async (isbn: string): Promise<ISBNSearchResponse> => {
    try {
      // 검색 API 호출
      const response = await authAxiosInstance.get(`/api/book/search/isbn?isbn13=${isbn}`);
      return response.data; // 여기에 .data를 추가
    } catch (error) {
      console.error('ISBN 검색 API 오류:', error);
      throw error;
    }
  },
};

export default bookAddService;
