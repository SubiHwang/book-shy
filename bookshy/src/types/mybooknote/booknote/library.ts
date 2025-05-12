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

export interface UnwrittenLibraryBook {
  libraryId: number;
  bookId: number;
  aladinItemId: number;
  isbn13: string;
  title: string;
  author: string;
  coverImageUrl: string;
  description: string;
  public: boolean;
}
