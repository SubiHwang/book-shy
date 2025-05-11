export interface BookQuote {
  bookId: number;
  title: string;
  author?: string;
  description?: string;
  publisher?: string;
  pubDate?: string;
  coverUrl?: string;

  // review
  quoteId: number;
  content: string;
  createdAt?: string;
}
