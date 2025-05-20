// 거래 약속 카드용
export interface TradePromise {
  tradeId: number;
  type: 'EXCHANGE' | 'RENTAL';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  scheduledTime: string;
  requestedAt: string;
  myBookId: number;
  myBookTitle: string;
  myBookCoverUrl: string;
  partnerBookId: number;
  partnerBookTitle: string;
  partnerBookCoverUrl: string;
  counterpart: {
    userId: number;
    nickname: string;
    profileImageUrl: string;
  };
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
export interface TradeBook {
  bookId: number;
  title: string;
  author: string;
  coverUrl: string;
}

// 거래 완료 내역
export interface TradeHistory {
  tradeId: number;
  completedAt: string;
  place: string;
  tradeType: 'EXCHANGE' | 'RENTAL';
  counterpartNickname: string;
  counterpartProfileImageUrl: string;
  receivedBooks: TradeBook[];
  givenBooks: TradeBook[];
}

// 거래 완료 내역 그룹 (월별)
export interface TradeHistoryGroup {
  yearMonth: string;
  trades: TradeHistory[];
}

// 거래 내역 전체 응답
export type TradeHistoryListResponse = TradeHistoryGroup[];
