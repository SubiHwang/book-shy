import { authAxiosInstance } from '@/services/axiosInstance';
import type {
  BookTrip,
  CreateBookTripRequest,
  UpdateBookTripRequest,
  LibraryBookWithTrip,
  BookTripWithUser,
} from '@/types/mybooknote/booktrip/booktrip';

// ✅ 책의 여정 전체 조회
export const fetchBookTripsByBookId = (bookId: number): Promise<BookTripWithUser[]> => {
  return authAxiosInstance.get('/booktrip', {
    params: { bookId },
  });
};

// ✅ 책의 여정 등록
export const createBookTrip = (trip: CreateBookTripRequest): Promise<BookTrip> => {
  return authAxiosInstance.post('/booktrip', trip);
};

// ✅ 책의 여정 수정
export const updateBookTrip = (
  tripId: number,
  update: UpdateBookTripRequest,
): Promise<BookTrip> => {
  return authAxiosInstance.put(`/booktrip/${tripId}`, update);
};

// ✅ 책의 여정 삭제
export const deleteBookTrip = (tripId: number): Promise<void> => {
  return authAxiosInstance.delete(`/booktrip/${tripId}`);
};

// ✅ 여정 작성 여부 포함 서재 목록 조회
export const fetchLibraryBooksWithTrip = (): Promise<LibraryBookWithTrip[]> => {
  return authAxiosInstance.get('/library/with-trip');
};

// ✅ 내가 여정은 작성했지만 서재에는 없는 책 목록 조회
export const fetchMyTripsOutsideLibrary = (): Promise<BookTripWithUser[]> => {
  return authAxiosInstance.get('/booktrip/my-only-not-in-library');
};
