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
