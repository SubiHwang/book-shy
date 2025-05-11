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
