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

export interface ReviewStatusResponse {
  hasReviewed: boolean;
  reviewStatus: {
    myReview?: {
      rating: number;
      ratings: {
        condition: number;
        punctuality: number;
        manner: number;
      };
      submittedAt: string;
    };
    partnerReview: {
      hasSubmitted: boolean;
      submittedAt: string | null;
    };
  };
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
  books: {
    title: string;
    bookId: number;
    libraryId: number;
    aladinItemId: number;
    fromMatching: boolean;
  }[];
  tradeType?: 'EXCHANGE' | 'RENTAL'; // ✅ 추가
}
