export interface MatchingRecommendation {
  userId: number;
  nickname: string;
  address: string;
  profileImageUrl: string;
  temperature: number;
  myBookId: number[];
  myBookName: string[];
  otherBookId: number[];
  otherBookName: string[];
  matchedAt: string;
  score: number;
}

export interface MatchingRecommendationResponse {
  candidates: MatchingRecommendation[];
  currentPage: number;
  results: number;
  totalPages: number;
}

export interface MatchingConfirmResponse {
  matchId: number;
  chatRoomId: number;
}

export interface Neighborhood {
  userId: number;
  name: string;
  location: string;
  profileImage: string;
  shyScore: number;
  farfrom: number;
}

export interface NoRecommendationStateProps {
  onRetry: () => void;
}

export interface MatchingListProps {
  matchings: MatchingRecommendation[];
}

export interface MatchingCardProps {
  matching: MatchingRecommendation;
  onChatClick: (id: number) => void;
}

export interface NeighborhoodCardProps {
  neighborhood: Neighborhood;
}

export interface CreateChatRoomReq {
  user1Id: number;
  user2Id: number;
  bookId?: number;
  message?: string;
}
export interface CreateChatRoomRes {
  roomId: number;
  status: 'CREATED' | 'EXISTS';
  message: string;
}
