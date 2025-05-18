import { authAxiosInstance } from '@/services/axiosInstance';
import type { TradeReviewRequest } from '@/types/chat/trade';

export async function submitTradeReview(
  payload: TradeReviewRequest,
): Promise<{ isTradeCompleted: boolean }> {
  return await authAxiosInstance.post('/trades/reviews', payload);
}
