import { authAxiosInstance } from '@/services/axiosInstance';
import type { TradeReviewRequest } from '@/types/chat/trade';
import axios from 'axios';

export async function submitTradeReview(
  payload: TradeReviewRequest,
): Promise<{ isTradeCompleted: boolean }> {
  return await authAxiosInstance.post('/trades/reviews', payload);
}

interface ReviewStatusResponse {
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

export const checkReviewStatus = async (
  roomId: number,
  requestId: number,
): Promise<ReviewStatusResponse> => {
  const response = await axios.get<ReviewStatusResponse>('/api/trades/reviews/status', {
    params: { roomId, requestId },
  });
  return response.data;
};
