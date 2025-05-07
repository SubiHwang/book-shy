import { authAxiosInstance } from '@/services/axiosInstance';
import type { LibraryBook } from '@/types/mybooknote/library';

export const fetchLibraryBooks = async (userId: number): Promise<LibraryBook[]> => {
  return (await authAxiosInstance.get(`/library?userId=${userId}`)) as LibraryBook[];
};
