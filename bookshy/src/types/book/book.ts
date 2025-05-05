export interface Book {
  bookId: number;
  title?: string;
  author?: string;
  translator?: string;
  publisher?: string;
  summary?: string;
  publishDate?: string;
  pages?: number;
  categories?: string;
  bookImgUrl?: string;
}

export interface WishBook extends Book {
  isLiked: boolean;
}

export interface WishBookProps {
  wishBook: WishBook;
}

export interface LibraryBook extends Book {
  libraryId: number;
  isPublic: boolean;
  registeredAt: string;
}

export interface BookSearchItemProps {
  book: Book;
  onAddBook: (bookId: number) => void;
}
