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
