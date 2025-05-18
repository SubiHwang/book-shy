export interface TradeReviewRequest {
  requestId: number;
  ratings: {
    condition: number;
    punctuality: number;
    manner: number;
  };
  selectedBookTitles: string[];
}

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
  reviewerId: number;
  revieweeId: number;
  rating: number;
  ratings: {
    condition: number;
    punctuality: number;
    manner: number;
  };
  books: ReviewedBook[];
}
