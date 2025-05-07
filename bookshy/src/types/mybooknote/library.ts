export interface LibraryBook {
  libraryId: number;
  aladinItemId: number | null;
  isbn13: string;
  title: string;
  author: string;
  coverImageUrl: string;
  public: boolean;
}
