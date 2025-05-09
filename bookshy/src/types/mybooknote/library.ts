export interface LibraryBook {
  libraryId: number;
  aladinItemId: number | null;
  bookId: number;
  isbn13: string;
  title: string;
  author: string;
  coverImageUrl: string;
  public: boolean;
}
