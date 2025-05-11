import type { LibraryBook } from '../booknote';

export interface LibraryBookWithTrip extends LibraryBook {
  hasTrip: boolean; // ✅ 나의 책 여정 존재 여부
}

export interface BookTrip {
  tripId: number;
  bookId: number;
  userId: number;
  content: string;
  createdAt: string;
}

export interface CreateBookTripRequest {
  bookId: number;
  content: string;
}

export interface UpdateBookTripRequest {
  content: string;
}
