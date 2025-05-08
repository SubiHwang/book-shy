import { useQuery } from '@tanstack/react-query';
import { fetchBookNotes } from '@/services/mybooknote/booknote';
import { fetchBookQuotes } from '@/services/mybooknote/bookquote';
import BookGridPetalPage from './MyBookNoteGridPage';
import LibraryBookListPage from './LibraryBookListPage';
import type { BookNote } from '@/types/mybooknote/booknote';
import type { BookQuote } from '@/types/mybooknote/bookquote';

const MyBookNotePage = () => {
  const userId = 1;

  const { data: notes = [], isLoading: notesLoading } = useQuery<BookNote[], Error>({
    queryKey: ['my-booknotes', userId],
    queryFn: () => fetchBookNotes(userId),
  });

  const { data: quotes = [], isLoading: quotesLoading } = useQuery<BookQuote[], Error>({
    queryKey: ['my-bookquotes'],
    queryFn: fetchBookQuotes,
  });

  const enrichedNotes = notes.map((note) => {
    const quote = quotes.find((q) => q.bookId === note.bookId);
    return {
      ...note,
      quoteContent: quote?.content ?? '',
    };
  });

  if (notesLoading || quotesLoading) return <p className="p-4">불러오는 중...</p>;

  return enrichedNotes.length > 0 ? (
    <BookGridPetalPage bookNotes={enrichedNotes} />
  ) : (
    <LibraryBookListPage />
  );
};

export default MyBookNotePage;
