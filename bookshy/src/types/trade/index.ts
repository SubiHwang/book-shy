// 거래 약속 카드용
export interface TradePromise {
  tradeId: number;
  bookTitle: string;
  counterpart: {
    userId: number;
    nickname: string;
    profileImageUrl: string;
  };
  scheduledTime: string;
  place?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CONFIRMED';
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    display: string;
  };
}

// 거래 약속 리스트 전체 응답
export interface TradePromiseListResponse {
  content: TradePromise[];
  totalElements: number;
  totalPages: number;
  number: number;
}

// 거래 내역 도서 정보
export interface ReceivedBook {
  title: string;
  author: string;
  coverImageUrl: string;
}

// 거래 완료 내역
export interface TradeHistory {
  tradeId: number;
  counterpart: {
    userId: number;
    nickname: string;
    profileImageUrl: string;
  };
  completedAt: string;
  receivedBook: ReceivedBook;
  place: string;
  status: 'COMPLETED';
}

// 거래 완료 내역 그룹 (월별)
export interface TradeHistoryGroup {
  yearMonth: string;
  trades: TradeHistory[];
}

// 거래 내역 전체 응답
export interface TradeHistoryListResponse {
  content: TradeHistoryGroup[];
  totalElements: number;
  totalPages: number;
  number: number;
}
