import {
  BookSearchSuggestionResponse,
  PopularSearchTermResponse,
  WishBooksResponse,
} from '@/types/Matching/wishBooks';
import { WishBook } from '@/types/book';
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

export const getWishBookList = async (): Promise<WishBooksResponse> => {
  try {
    const response = await authAxiosInstance.get<string, WishBooksResponse>(`/book/wish`);
    console.log('읽고 싶은 책 목록 API 응답:', response);
    return response;
  } catch (error) {
    console.error('읽고 싶은 책 목록 API 호출 중 오류 발생:', error);
    throw error; // 오류를 다시 던져서 호출한 곳에서 처리할 수 있도록 함
  }
};

export const addWishBook = async (itemId: number): Promise<boolean> => {
  try {
    const response = await authAxiosInstance.post<string, boolean>(`/book/wish?itemId=${itemId}`);
    console.log('읽고 싶은 책 추가 API 응답:', response);
    return response;
  } catch (error) {
    console.error('읽고 싶은 책 추가 API 호출 중 오류 발생:', error);
    throw error; // 오류를 다시 던져서 호출한 곳에서 처리할 수 있도록 함
  }
};

export const deleteWishBook = async (itemId: number): Promise<boolean> => {
  try {
    const response = await authAxiosInstance.delete<string, boolean>(
      `/book/wish/remove?itemId=${itemId}`,
    );
    console.log('읽고 싶은 책 삭제 API 응답:', response);
    return response;
  } catch (error) {
    console.error('읽고 싶은 책 삭제 API 호출 중 오류 발생:', error);
    throw error; // 오류를 다시 던져서 호출한 곳에서 처리할 수 있도록 함
  }
};

export const getWishBookDetail = async (itemId: number): Promise<WishBook> => {
  try {
    const response = await authAxiosInstance.get<string, WishBook>(
      `/book/search/detail?itemId=${itemId}`,
    );
    console.log('읽고 싶은 책 상세 API 응답:', response);
    return response;
  } catch (error) {
    console.error('읽고 싶은 책 상세 API 호출 중 오류 발생:', error);
    throw error; // 오류를 다시 던져서 호출한 곳에서 처리할 수 있도록 함
  }
};

export const getRecommandationBooks = async (): Promise<WishBooksResponse> => {
  try {
    const response = await authAxiosInstance.get<string, WishBooksResponse>('/recommendations');
    console.log('추천 도서 API 응답:', response);
    return response;
  } catch (error) {
    console.error('추천 도서 API 호출 중 오류 발생:', error);
    throw error;
  }
};

export const getPopularSearchTerms = async (): Promise<PopularSearchTermResponse> => {
  try {
    const response = await authAxiosInstance.get<string, PopularSearchTermResponse>('/trending');
    console.log('실시간 인기 검색어 호출 응답', response);
    return response;
  } catch (error) {
    console.error('실시간 인기 검색어 호출 오류 발생:', error);
    throw error;
  }
};

export const getBookSuggestions = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) {
    return []; // 빈 검색어나 짧은 검색어는 빈 배열 반환
  }

  try {
    const response = await authAxiosInstance.get<string, BookSearchSuggestionResponse>(
      `/auto?q=${query}`,
    );
    console.log(response);
    // 응답에서 키워드 추출하여 문자열 배열로 변환
    return response.items.map((item) => item.keyword);
  } catch (error) {
    console.error('자동완성 API 오류:', error);
    // 오류 발생 시 빈 배열 반환
    return [];
  }
};
