import { authAxiosInstance } from '@/services/axiosInstance';
import type { BookNote } from '@/types/mybooknote/booknote';

// 📚 나의 독후감 목록 조회
export const fetchBookNoteList = async (): Promise<BookNote[]> => {
  const res: BookNote[] = await authAxiosInstance.get('/notes');
  return res ?? [];
};

// 📚 나의 독후감 1권 조회
export const fetchBookNote = async (bookId: number): Promise<BookNote> => {
  const res: BookNote = await authAxiosInstance.get('/notes', {
    params: { bookId },
  });
  return res ?? [];
};

// ✍️ 독후감 등록
export const createBookNote = async (bookId: number, content: string): Promise<void> => {
  await authAxiosInstance.post('/notes', {
    bookId,
    content,
  });
};

// ✏️ 독후감 수정
export const updateBookNote = async (reviewId: number, content: string): Promise<void> => {
  await authAxiosInstance.put(`/books/notes/${reviewId}`, {
    content,
  });
};
