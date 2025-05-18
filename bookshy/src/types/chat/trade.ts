export interface TradeReviewResponse {
  success: boolean;
  message?: string;
}

export interface ReviewedBook {
  title: string;
  bookId: number;
  libraryId: number;
  aladinItemId: number;
  fromMatching: boolean;
}

export interface TradeReviewRequest {
  requestId: number;
  userIds: number[]; // reviewer + reviewee 둘 다 포함
  rating: number;
  ratings: {
    condition: number;
    punctuality: number;
    manner: number;
  };
  books: ReviewedBook[];
}
