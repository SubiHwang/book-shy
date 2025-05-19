import { useQuery } from '@tanstack/react-query';
import { fetchBookNoteList } from '@/services/mybooknote/booknote/booknote';
import { fetchBookQuoteList } from '@/services/mybooknote/booknote/bookquote';
import { fetchUserAllLibrary } from '@/services/mylibrary/libraryApi';

import BookNoteSwiperPage from './BookNoteSwiperPage';
import LibraryBookListPage from './LibraryBookListPage';

import type { BookNote } from '@/types/mybooknote/booknote';
import type { BookQuote } from '@/types/mybooknote/booknote/bookquote';
import type { Library } from '@/types/mylibrary/library';
import Loading from '@/components/common/Loading';

const MyBookNotePage = () => {
  const { data: libraries = [], isLoading: libLoading } = useQuery<Library[]>({
    queryKey: ['user-library'],
    queryFn: fetchUserAllLibrary,
  });

  const { data: notes = [] } = useQuery<BookNote[]>({
    queryKey: ['my-booknotes'],
    queryFn: fetchBookNoteList,
  });

  const { data: quotes = [] } = useQuery<BookQuote[]>({
    queryKey: ['my-bookquotes'],
    queryFn: fetchBookQuoteList,
  });

  const enrichedBooks = libraries.map((book) => {
    const note = notes.find((n) => n.bookId === book.bookId);
    const quote = quotes.find((q) => q.bookId === book.bookId);

    return {
      libraryId: book.libraryId,
      bookId: book.bookId,
      title: book.title,
      author: book.author,
      coverUrl: book.coverImageUrl,
      reviewId: note?.reviewId,
      content: note?.content || '',
      createdAt: note?.createdAt,
      quoteContent: quote?.content || '',
    };
  });

  if (libLoading) return <Loading loadingText="불러오는 중..." />;

  return enrichedBooks.length > 0 ? (
    <BookNoteSwiperPage bookNotes={enrichedBooks} />
  ) : (
    <LibraryBookListPage />
  );
};

export default MyBookNotePage;
