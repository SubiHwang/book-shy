import { authAxiosInstance } from '@/services/axiosInstance';
import type { TradePromise, TradeHistoryGroup } from '@/types/trade';

// 거래 약속 목록 조회
export const fetchTradePromises = async (): Promise<TradePromise[]> => {
  const res = await authAxiosInstance.get<TradePromise[]>('/trades/promise');
  return res.data ?? [];
};

// 완료된 거래 내역 조회
export const fetchTradeHistory = async (): Promise<TradeHistoryGroup[]> => {
  const res = await authAxiosInstance.get<TradeHistoryGroup[]>('/trades/history');
  return res.data ?? [];
};
