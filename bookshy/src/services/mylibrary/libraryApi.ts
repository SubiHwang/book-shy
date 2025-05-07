import { authAxiosInstance } from '@/services/axiosInstance';
import type { Library } from '@/types/mylibrary/library';

export const fetchUserLibrary = async (userId: number): Promise<Library[]> => {
  try {
    // 개발 중이므로 publicAxiosInstance를 사용 (나중에 authAxiosInstance로 변경 가능)
    const response = await authAxiosInstance.get<Library[]>(`/library?userId=${userId}`);
    return response as unknown as Library[];
    // response.data를 자동으로 반환하도록 인터셉터가 설정되어 있어서 타입 변환이 필요
  } catch (error) {
    console.error('서재 목록 조회 오류:', error);
    throw error;
  }
};
