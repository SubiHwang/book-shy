import { useQuery } from '@tanstack/react-query';
import { fetchBookNoteList } from '@/services/mybooknote/booknote';
import { fetchBookQuoteList } from '@/services/mybooknote/bookquote';
import MyBookNoteGridPage from './MyBookNoteGridPage';
import LibraryBookListPage from './LibraryBookListPage';
import type { BookNote } from '@/types/mybooknote/booknote';
import type { BookQuote } from '@/types/mybooknote/bookquote';

const MyBookNotePage = () => {
  const { data: notes = [], isLoading: notesLoading } = useQuery<BookNote[], Error>({
    queryKey: ['my-booknotes'],
    queryFn: () => fetchBookNoteList(),
  });

  const { data: quotes = [], isLoading: quotesLoading } = useQuery<BookQuote[], Error>({
    queryKey: ['my-bookquotes'],
    queryFn: fetchBookQuoteList,
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
    <MyBookNoteGridPage bookNotes={enrichedNotes} />
  ) : (
    <LibraryBookListPage />
  );
};

export default MyBookNotePage;
