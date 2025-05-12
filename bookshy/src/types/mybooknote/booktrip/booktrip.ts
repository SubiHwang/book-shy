import type { LibraryBook } from '../booknote';

export interface BookTripBookItem {
  tripId: number;
  userId: number;
  bookId: number;
  title: string;
  author: string;
  coverImageUrl: string;
  content: string;
  createdAt: string;
  hasTrip: true; // 항상 true
  userProfile: {
    nickname: string;
    profileImageUrl: string;
  };
  mine: boolean;
}

export interface BookTripListItem {
  bookId: number;
  title: string;
  author: string;
  coverImageUrl: string;
  hasTrip: boolean;
}

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

export interface BookTripWithUser extends BookTrip {
  userProfile: {
    nickname: string;
    profileImageUrl: string;
  };
  mine: boolean;
}

export interface CreateBookTripRequest {
  bookId: number;
  content: string;
}

export interface UpdateBookTripRequest {
  content: string;
}
