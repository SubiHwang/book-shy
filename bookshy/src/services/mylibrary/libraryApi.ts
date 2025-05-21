import { authAxiosInstance } from '@/services/axiosInstance';
import type { Library } from '@/types/mylibrary/library';

export const fetchUserAllLibrary = async (): Promise<Library[]> => {
  try {
    const response = await authAxiosInstance.get<Library[]>(`/library`);
    return response as unknown as Library[];
  } catch (error) {
    console.error('서재 목록 조회 오류:', error);
    throw error;
  }
};

// 사용자의 공개 서재 목록 조회
export const fetchUserPublicLibrary = async (): Promise<Library[]> => {
  try {
    const response = await authAxiosInstance.get<Library[]>(`/library/public`);
    return response as unknown as Library[];
  } catch (error) {
    console.error('공개 서재 목록 조회 오류:', error);
    throw error;
  }
};

// bookId로 내 서재에서 해당 도서 정보 조회
export const fetchLibraryByBookId = async (bookId: number): Promise<Library | null> => {
  try {
    const response = await authAxiosInstance.get(`/library`, {
      params: { bookId },
    });
    const lib = response as unknown as Library;
    if (lib && typeof lib === 'object' && 'libraryId' in lib) {
      return lib;
    }
    return null;
  } catch (error) {
    console.error('bookId로 서재 도서 조회 오류:', error);
    return null;
  }
};
