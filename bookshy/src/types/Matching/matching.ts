export interface MatchingRecommendation {
  id: number;
  name: string;
  profileImage: string;
  matchingPercent: number;
  shyScore: number;
  location: string;
  myWishBooks: string[];
  yourWishBooks: string[];
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
