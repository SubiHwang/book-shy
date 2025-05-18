import { authAxiosInstance } from '@/services/axiosInstance';
import type { TradeReviewRequest } from '@/types/chat/trade';

export async function submitTradeReview(payload: TradeReviewRequest): Promise<void> {
  await authAxiosInstance.post('/trades/reviews', payload);
}
