import { authAxiosInstance } from '@/services/axiosInstance';
import type { TradeReviewRequest, TradeReviewResponse } from '@/types/chat/trade';

export async function submitTradeReview(payload: TradeReviewRequest): Promise<TradeReviewResponse> {
  return await authAxiosInstance.post('/trades/reviews', payload);
}
