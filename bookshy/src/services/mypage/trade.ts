import { authAxiosInstance } from '@/services/axiosInstance';
import type {
  TradePromise,
  TradePromiseListResponse,
  TradeHistoryGroup,
  TradeHistoryListResponse,
} from '@/types/trade';

const userId = 1;

// 거래 약속 목록 조회
export const fetchTradePromises = async (): Promise<TradePromise[]> => {
  if (!userId) throw new Error('유저 ID가 없습니다.');

  const res = (await authAxiosInstance.get('/trades/promises', {
    params: { page: 0, size: 10 },
    headers: {
      'X-User-Id': userId,
    },
  })) as TradePromiseListResponse;

  return res.content ?? [];
};

// 완료된 거래 내역 조회
export const fetchTradeHistory = async (): Promise<TradeHistoryGroup[]> => {
  if (!userId) throw new Error('유저 ID가 없습니다.');

  const res = (await authAxiosInstance.get('/trades/history', {
    params: { page: 0, size: 10 },
    headers: {
      'X-User-Id': userId,
    },
  })) as TradeHistoryListResponse;

  return res.content ?? [];
};
