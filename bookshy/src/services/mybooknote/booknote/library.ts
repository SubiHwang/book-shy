import { authAxiosInstance } from '@/services/axiosInstance';
import type { LibraryBook, UnwrittenLibraryBook } from '@/types/mybooknote/booknote/library';

export const fetchLibraryBooks = async (): Promise<LibraryBook[]> => {
  return (await authAxiosInstance.get(`/library`)) as LibraryBook[];
};

// 🟡 독후감 미작성 도서 목록 조회
export const fetchUnwrittenBooks = async (): Promise<UnwrittenLibraryBook[]> => {
  const data: UnwrittenLibraryBook[] = await authAxiosInstance.get('/library/unwritten-notes');
  return data;
};
