export interface Library {
  libraryId: number;
  bookId: number;
  aladinItemId: number;
  isbn13: string;
  title: string;
  author: string;
  coverImageUrl: string;
  public: boolean;
}
export interface LibraryBookProps {
  books: (Library | null)[];
}
