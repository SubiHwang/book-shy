import { authAxiosInstance } from '../axiosInstance';
import { MatchingRecommendationResponse, MatchingConfirmResponse } from '@/types/Matching';
export const getMatchingList = async () => {
  try {
    const response = await authAxiosInstance.get<string, MatchingRecommendationResponse>(
      '/matching/candidates',
    );
    console.log('매칭 목록 api 조회', response);
    return response;
  } catch (error) {
    console.log('매칭 목록 api 조회 중 에러 발생', error);
    throw error;
  }
};

export const getChatId = async (receiverId: number) => {
  try {
    const response = await authAxiosInstance.post<string, MatchingConfirmResponse>(
      '/matching/chat',
      {
        receiverId: receiverId,
      },
    );
    console.log('매칭 확정 요청 api 호출 응답', response);
    return response;
  } catch (error) {
    console.log('매칭 확정 요청 api 조회 중 에러 발생', error);
    throw error;
  }
};
