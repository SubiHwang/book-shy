// services/book/upload.ts
import { authAxiosInstance } from '@/services/axiosInstance';
import type { Book } from '@/types/book/book';

// itemId로 book 등록하고 bookId 리턴
export const uploadBookByItemId = async (itemId: number): Promise<Book> => {
  const { data } = await authAxiosInstance.post(`/book/upload`, null, {
    params: { itemId },
  });
  return data;
};
