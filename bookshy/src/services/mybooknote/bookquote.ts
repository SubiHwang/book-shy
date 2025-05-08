import { authAxiosInstance } from '@/services/axiosInstance';
import type { BookQuote } from '@/types/mybooknote/bookquote';

const userId = 1;

// 📚 나의 인용구 목록 조회
export const fetchBookQuotes = async (): Promise<BookQuote[]> => {
  if (!userId) throw new Error('유저 ID가 없습니다.');

  const res = await authAxiosInstance.get('/quotes', {
    headers: { 'X-User-Id': userId },
  });

  return res.data ?? [];
};

// ✍️ 인용구 등록
export const createBookQuote = async (bookId: number, content: string): Promise<void> => {
  await authAxiosInstance.post(
    '/quotes',
    { userId, bookId, content },
    { headers: { 'X-User-Id': userId } },
  );
};

// ✏️ 인용구 수정
export const updateBookQuote = async (quoteId: number, content: string): Promise<void> => {
  await authAxiosInstance.put(`/quotes/${quoteId}`, {
    content,
  });
};
