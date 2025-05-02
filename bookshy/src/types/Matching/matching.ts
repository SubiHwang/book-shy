export interface MatchingRecommendation {
  id: number;
  name: string;
  profileImage: string;
  matchingPercent: number;
  shyScore: number;
  location: string;
  myWishBooks: string[];
  theirBooks: string[];
}

export interface NoRecommendationStateProps {
  onRetry: () => void;
}

export interface MatchingListProps {
  matchings: MatchingRecommendation[];
  onChatClick: (id: number) => void;
}
