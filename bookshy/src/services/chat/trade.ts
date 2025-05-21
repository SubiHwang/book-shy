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

interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string | null;
  data: T;
  error: string | null;
  timestamp: string;
}

export const checkReviewStatus = async (
  roomId: number,
  requestId: number,
): Promise<ReviewStatusResponse> => {
  try {
    console.log('리뷰 상태 확인 요청:', { roomId, requestId });
    const response = await authAxiosInstance.get<ApiResponse<ReviewStatusResponse>>(
      '/trades/reviews/status',
      {
        params: { roomId, requestId },
      },
    );
    return response as unknown as ReviewStatusResponse;
  } catch (error) {
    console.error('리뷰 상태 확인 API 호출 실패:', error);
    // 기본값 반환
    return {
      hasReviewed: false,
      reviewStatus: {
        partnerReview: {
          hasSubmitted: false,
          submittedAt: null,
        },
      },
    };
  }
};
