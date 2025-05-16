import { NeighborBookshelf } from '@/types/book';
import { authAxiosInstance } from '../axiosInstance';
import {
  MatchingRecommendationResponse,
  MatchingConfirmResponse,
  Neighborhood,
} from '@/types/Matching';
export const getMatchingList = async (page: number) => {
  try {
    const response = await authAxiosInstance.get<string, MatchingRecommendationResponse>(
      `/matching/candidates?page=${page}`,
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
      `/matching/chat?receiverId=${receiverId}`,
    );
    console.log('매칭 확정 요청 api 호출 응답', response);
    return response;
  } catch (error) {
    console.log('매칭 확정 요청 api 조회 중 에러 발생', error);
    throw error;
  }
};

export const getNeighborhoodList = async () => {
  try {
    const response = await authAxiosInstance.get<[], Neighborhood[]>('/matching/neighbors');
    console.log('이웃들의 목록', response);
    return response;
  } catch (error) {
    console.log('이웃들의 목록 불러오기 에러', error);
    throw error;
  }
};

export const getNeighborhoodBookShelf = async (userId: number) => {
  try {
    const response = await authAxiosInstance.get<string, NeighborBookshelf>(
      `/matching/public/${userId}`,
    );
    console.log('이웃의 서재', response);
    return response;
  } catch (error) {
    console.log('이웃의 서재 불러오기 에러', error);
    throw error;
  }
};
