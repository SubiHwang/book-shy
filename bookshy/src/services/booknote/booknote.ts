import { authAxiosInstance } from '@/services/axiosInstance';
import type { BookNote } from '@/types/booknote';

const userId = 1;

// 나의 독서 기록 목록 조회
type BookNoteListResponse = {
  content: BookNote[];
};

export const fetchBookNotes = async (): Promise<BookNote[]> => {
  if (!userId) throw new Error('유저 ID가 없습니다.');

  const res = (await authAxiosInstance.get('/notes', {
    headers: { 'X-User-Id': userId },
  })) as BookNoteListResponse;

  return res.content ?? [];
};

// 독후감 등록
export const createBookNote = async (bookId: number, content: string): Promise<void> => {
  await authAxiosInstance.post('/notes', {
    userId,
    bookId,
    content,
  });
};
