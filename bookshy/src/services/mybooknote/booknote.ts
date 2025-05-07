import { authAxiosInstance } from '@/services/axiosInstance';
import type { BookNote } from '@/types/mybooknote/booknote';

const userId = 1;

export const fetchBookNotes = async (): Promise<BookNote[]> => {
  return (await authAxiosInstance.get('/notes', {
    headers: { 'X-User-Id': userId },
  })) as BookNote[];
};

// 독후감 등록
export const createBookNote = async (bookId: number, content: string): Promise<void> => {
  await authAxiosInstance.post('/notes', {
    userId,
    bookId,
    content,
  });
};
