import { authAxiosInstance } from '@/services/axiosInstance';
import type { BookQuote } from '@/types/mybooknote/bookquote';

// 📚 나의 인용구구 목록 조회
export const fetchBookQuoteList = async (): Promise<BookQuote[]> => {
  const res: BookQuote[] = await authAxiosInstance.get('/quotes');
  return res ?? [];
};

// 📚 특정 도서의 인용구 조회
export const fetchBookQuote = async (bookId: number): Promise<BookQuote[]> => {
  const res = await authAxiosInstance.get('/quotes', {
    params: { bookId },
  });
  return res.data ?? [];
};

// ✍️ 인용구 등록
export const createBookQuote = async (bookId: number, content: string): Promise<void> => {
  await authAxiosInstance.post('/quotes', { bookId, content });
};

// ✏️ 인용구 수정
export const updateBookQuote = async (quoteId: number, content: string): Promise<void> => {
  await authAxiosInstance.put(`/quotes/${quoteId}`, {
    content,
  });
};
