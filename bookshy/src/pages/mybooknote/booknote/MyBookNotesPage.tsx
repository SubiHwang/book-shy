import { useQuery } from '@tanstack/react-query';
import { fetchBookNoteList } from '@/services/mybooknote/booknote/booknote';
import { fetchBookQuoteList } from '@/services/mybooknote/booknote/bookquote';
import { fetchUserAllLibrary } from '@/services/mylibrary/libraryApi';
import { fetchBookDetailByBookId } from '@/services/book/search';

import BookNoteSwiperPage from './BookNoteSwiperPage';
import LibraryBookListPage from './LibraryBookListPage';

import type { BookNote } from '@/types/mybooknote/booknote';
import type { BookQuote } from '@/types/mybooknote/booknote/bookquote';
import type { Library } from '@/types/mylibrary/library';
import { useEffect, useState } from 'react';
import type { Book } from '@/types/book/book';

const MyBookNotePage = () => {
  const { data: libraries = [] } = useQuery<Library[]>({
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

  const [enrichedBooks, setEnrichedBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const enrich = async () => {
      setLoading(true);
      const results = await Promise.all(
        notes.map(async (note) => {
          const library = libraries.find((lib) => lib.bookId === note.bookId);
          const quote = quotes.find((q) => q.bookId === note.bookId);

          // library 정보 없으면 개별 fetch
          let bookDetail: Book | undefined;
          if (!library) {
            try {
              bookDetail = await fetchBookDetailByBookId(note.bookId);
            } catch (e) {
              console.warn('book detail fetch 실패:', note.bookId);
            }
          }

          return {
            libraryId: library?.libraryId ?? -1,
            bookId: note.bookId,
            title: library?.title ?? bookDetail?.title ?? '제목 없음',
            author: library?.author ?? bookDetail?.author ?? '',
            coverUrl: library?.coverImageUrl ?? bookDetail?.coverImageUrl ?? '',
            reviewId: note.reviewId,
            content: note.content || '',
            createdAt: note.createdAt,
            quoteContent: quote?.content || '',
          };
        }),
      );

      setEnrichedBooks(results);
      setLoading(false);
    };

    if (notes.length > 0) {
      enrich();
    } else {
      setLoading(false);
    }
  }, [notes, quotes, libraries]);

  if (loading) return <p className="p-4">불러오는 중...</p>;

  return enrichedBooks.length > 0 ? (
    <BookNoteSwiperPage bookNotes={enrichedBooks} />
  ) : (
    <LibraryBookListPage />
  );
};

export default MyBookNotePage;
