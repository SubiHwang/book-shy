// @/services/book/search.ts
import { authAxiosInstance } from '@/services/axiosInstance';

export interface BookDetail {
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

// 📘 알라딘 고유 itemId를 기반으로 도서 상세 정보 조회
export const fetchBookDetailByItemId = async (itemId: number): Promise<BookDetail> => {
  const response = await authAxiosInstance.get(`/book/search/detail`, {
    params: { itemId },
  });
  return response.data;
};
