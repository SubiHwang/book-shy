import { WishBooksResponse } from '@/types/Matching/wishBooks';
import { authAxiosInstance } from '../axiosInstance';

export const getSearchResult = async (searchTerm: string): Promise<WishBooksResponse> => {
  try {
    const response = await authAxiosInstance.get<string, WishBooksResponse>(
      `book/search/list?q=${searchTerm}`,
    );
    console.log('읽고 싶은 책 검색 API 응답:', response);
    return response;
  } catch (error) {
    console.error('읽고 싶은 책 검색 API 호출 중 오류 발생:', error);
    throw error; // 오류를 다시 던져서 호출한 곳에서 처리할 수 있도록 함
  }
};

export const getWishBookList = async (userId: number): Promise<WishBooksResponse> => {
  try {
    const response = await authAxiosInstance.get<string, WishBooksResponse>(
      `/book/wish?userId=${userId}`,
    );
    console.log('읽고 싶은 책 목록 API 응답:', response);
    return response;
  } catch (error) {
    console.error('읽고 싶은 책 목록 API 호출 중 오류 발생:', error);
    throw error; // 오류를 다시 던져서 호출한 곳에서 처리할 수 있도록 함
  }
};

export const addWishBook = async (userId: number, itemId: number): Promise<boolean> => {
  try {
    const response = await authAxiosInstance.post<string, boolean>(
      `/book/wish?userId=${userId}&itemId=${itemId}`,
    );
    console.log('읽고 싶은 책 추가 API 응답:', response);
    return response;
  } catch (error) {
    console.error('읽고 싶은 책 추가 API 호출 중 오류 발생:', error);
    throw error; // 오류를 다시 던져서 호출한 곳에서 처리할 수 있도록 함
  }
};

export const deleteWishBook = async (userId: number, itemId: number): Promise<boolean> => {
  try {
    const response = await authAxiosInstance.delete<string, boolean>(
      `/book/wish/remove?userId=${userId}&itemId=${itemId}`,
    );
    console.log('읽고 싶은 책 삭제 API 응답:', response);
    return response;
  } catch (error) {
    console.error('읽고 싶은 책 삭제 API 호출 중 오류 발생:', error);
    throw error; // 오류를 다시 던져서 호출한 곳에서 처리할 수 있도록 함
  }
};
