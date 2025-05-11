import { authAxiosInstance } from '@/services/axiosInstance';
import type {
  BookTrip,
  CreateBookTripRequest,
  UpdateBookTripRequest,
} from '@/types/mybooknote/booktrip/types';

// ✅ 책의 여정 전체 조회
export const fetchBookTripsByBookId = async (bookId: number): Promise<BookTrip[]> => {
  const { data } = await authAxiosInstance.get(`/api/booktrip`, {
    params: { bookId },
  });
  return data;
};

// ✅ 책의 여정 등록
export const createBookTrip = async (trip: CreateBookTripRequest): Promise<BookTrip> => {
  const { data } = await authAxiosInstance.post(`/api/booktrip`, trip);
  return data;
};

// ✅ 책의 여정 수정
export const updateBookTrip = async (
  tripId: number,
  update: UpdateBookTripRequest,
): Promise<BookTrip> => {
  const { data } = await authAxiosInstance.put(`/api/booktrip/${tripId}`, update);
  return data;
};

// ✅ 책의 여정 삭제
export const deleteBookTrip = async (tripId: number): Promise<void> => {
  await authAxiosInstance.delete(`/api/booktrip/${tripId}`);
};
