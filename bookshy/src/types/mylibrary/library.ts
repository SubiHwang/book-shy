export interface Library {
  libraryId: number;
  bookId: number;
  aladinItemId: number;
  isbn13: string;
  title: string;
  author: string;
  coverImageUrl: string;
  public: boolean;
  bookId: number;
}
export interface LibraryBookProps {
  books: (Library | null)[];
}
