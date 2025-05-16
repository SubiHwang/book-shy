import { WishBook } from './book';

export interface NeighborBookshelf {
  userId: number;
  nickname: string;
  books: WishBook[];
}

export interface BookshelfRowProps {
  books: (WishBook | null)[];
}
