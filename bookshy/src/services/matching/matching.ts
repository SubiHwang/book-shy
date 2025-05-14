import { authAxiosInstance } from '../axiosInstance';
import { MatchingRecommendation } from '@/types/Matching';
export const getMatchingList = async () => {
  try {
    const response = await authAxiosInstance.get<string, MatchingRecommendation[]>(
      '/matching/candidates',
    );
    console.log('매칭 목록 api 조회 중 에러 발생', response);
    return response;
  } catch (error) {
    console.log('매칭 목록 api 조회 중 에러 발생', error);
    throw error;
  }
};
