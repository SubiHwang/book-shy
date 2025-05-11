import { authAxiosInstance } from '@/services/axiosInstance';
import type {
  BookTrip,
  CreateBookTripRequest,
  UpdateBookTripRequest,
  LibraryBookWithTrip,
} from '@/types/mybooknote/booktrip/booktrip';

// ✅ 책의 여정 전체 조회
export const fetchBookTripsByBookId = async (bookId: number): Promise<BookTrip[]> => {
  const { data } = await authAxiosInstance.get(`/booktrip`, {
    params: { bookId },
  });
  return data;
};

// ✅ 책의 여정 등록
export const createBookTrip = async (trip: CreateBookTripRequest): Promise<BookTrip> => {
  const { data } = await authAxiosInstance.post(`/booktrip`, trip);
  return data;
};

// ✅ 책의 여정 수정
export const updateBookTrip = async (
  tripId: number,
  update: UpdateBookTripRequest,
): Promise<BookTrip> => {
  const { data } = await authAxiosInstance.put(`/booktrip/${tripId}`, update);
  return data;
};

// ✅ 책의 여정 삭제
export const deleteBookTrip = async (tripId: number): Promise<void> => {
  await authAxiosInstance.delete(`/booktrip/${tripId}`);
};

// ✅ 여정 작성 여부 포함 서재 목록 조회
export const fetchLibraryBooksWithTrip = async (): Promise<LibraryBookWithTrip[]> => {
  const { data } = await authAxiosInstance.get('/library/with-trip');
  return data;
};
