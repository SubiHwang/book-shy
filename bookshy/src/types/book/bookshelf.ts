import { Book } from "./book";

export interface NeighborBookshelf {
  userId: number;
  userNickName: string;
  books: Book[];
}

export interface BookshelfRowProps {
  books: (Book | null)[];
}