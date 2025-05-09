import { authAxiosInstance } from '@/services/axiosInstance';
import type { LibraryBook } from '@/types/mybooknote/library';

export const fetchLibraryBooks = async (): Promise<LibraryBook[]> => {
  return (await authAxiosInstance.get(`/library`)) as LibraryBook[];
};
