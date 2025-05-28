export interface Book {
  bookId?: number;
  itemId?: number;
  title?: string;
  author?: string;
  publisher?: string;
  description?: string;
  pubDate?: string;
  pageCount?: number;
  coverImageUrl?: string;
  bookImgUrl?: string;
  category?: string | null;
  isbn13?: string;
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

export interface BookDetailPageProps extends WishBook {
  isLoading?: boolean;
}

export interface SearchBookDetailPageProps extends Book {
  isLoading?: boolean;
}

export interface ExtendedSearchBookDetailPageProps extends SearchBookDetailPageProps {
  onAddBook?: (itemId: number) => void;
}
