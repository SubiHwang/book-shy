// src/services/mylibrary/bookDetailService.ts
import { authAxiosInstance } from '@/services/axiosInstance';

// 책 상세 정보 타입
export interface BookDetailResponse {
  title: string;
  author: string;
  publisher: string;
  coverImageUrl: string;
  description: string;
  pubDate: string;
  category: string;
  pageCount: number;
  isbn13: string;
  isPublic: boolean;
}

// 책 상세 정보 조회 API
export const fetchBookDetail = async (libraryId: number): Promise<BookDetailResponse> => {
  try {
    console.log(`책 상세 정보 요청: libraryId = ${libraryId}`);

    // API 호출
    const response = await authAxiosInstance.get<BookDetailResponse>(
      `/book/library/detail?libraryId=${libraryId}&userId=1`,
    );

    console.log('책 상세 정보 조회 성공:', response);
    return response as unknown as BookDetailResponse;
  } catch (error) {
    console.error('책 상세 정보 조회 오류:', error);
    throw error;
  }
};

// 책 공개 상태 변경 API
export const updateBookVisibility = async (libraryId: number, isPublic: boolean): Promise<void> => {
  try {
    console.log(`책 공개 상태 변경 요청: libraryId=${libraryId}, isPublic=${isPublic}`);

    // API 호출 - 새로운 엔드포인트 및 HTTP 메서드 사용
    await authAxiosInstance.patch(`/library/${libraryId}/public?isPublic=${isPublic}`);

    console.log('책 공개 상태 변경 성공');
  } catch (error) {
    console.error('책 공개 상태 변경 오류:', error);
    throw error;
  }
};
