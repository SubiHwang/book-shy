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
