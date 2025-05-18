import { NeighborBookshelf } from '@/types/book';
import { authAxiosInstance } from '../axiosInstance';
import {
  MatchingRecommendationResponse,
  MatchingConfirmResponse,
  Neighborhood,
} from '@/types/Matching';
export const getMatchingList = async (page: number, sort: string = 'score') => {
  try {
    const response = await authAxiosInstance.get<string, MatchingRecommendationResponse>(
      `/matching/candidates?page=${page}&sort=${sort}`,
    );
    console.log('매칭 목록 api 조회', response);
    return response;
  } catch (error) {
    console.log('매칭 목록 api 조회 중 에러 발생', error);
    throw error;
  }
};

export const getChatId = async (
  receiverId: number,
  myBookId: number[],
  myBookName: string[],
  otherBookId: number[],
  otherBookName: string[],
): Promise<MatchingConfirmResponse> => {
  const response = await authAxiosInstance.post<string, MatchingConfirmResponse>(
    `/matching/chat?receiverId=${receiverId}`,
    {
      myBookId,
      myBookName,
      otherBookId,
      otherBookName,
    },
  );
  return response;
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
