export interface BookNote {
  bookId: number;
  title: string;
  author?: string;
  description?: string;
  publisher?: string;
  pubDate?: string;
  coverUrl?: string;

  // review
  reviewId?: number;
  content: string;
  createdAt?: string;
}
