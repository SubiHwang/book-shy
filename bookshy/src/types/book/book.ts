export interface Book {
  itemId: number;
  title?: string;
  author?: string;
  publisher?: string;
  description?: string;
  publishDate?: string;
  pages?: number;
  coverImageUrl?: string;
  bookImgUrl?: string;
  categories?: string | null;
}

export interface WishBook extends Book {
  isLiked?: boolean;
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
