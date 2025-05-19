import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { fetchBookNoteList } from '@/services/mybooknote/booknote/booknote';
import { fetchBookQuoteList } from '@/services/mybooknote/booknote/bookquote';
import { fetchUserAllLibrary } from '@/services/mylibrary/libraryApi';
import { fetchBookDetailByBookId } from '@/services/book/search';
import { fetchRentalBooksInUse } from '@/services/chat/chat';

import BookNoteSwiperPage from './BookNoteSwiperPage';
import LibraryBookListPage from './LibraryBookListPage';

import type { BookNote } from '@/types/mybooknote/booknote';
import type { BookQuote } from '@/types/mybooknote/booknote/bookquote';
import type { Library } from '@/types/mylibrary/library';
import type { Book } from '@/types/book/book';

const MyBookNotePage = () => {
  const { data: libraries = [] } = useQuery({
    queryKey: ['user-library'],
    queryFn: fetchUserAllLibrary,
  });

  const { data: notes = [] } = useQuery({
    queryKey: ['my-booknotes'],
    queryFn: fetchBookNoteList,
  });

  const { data: quotes = [] } = useQuery({
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
            fromRental: false,
          };
        }),
      );

      // 🔄 렌탈 도서 추가
      try {
        const rentalBooks = await fetchRentalBooksInUse();
        rentalBooks.forEach((book) => {
          results.push({
            libraryId: -1,
            bookId: book.bookId!,
            title: book.title ?? '제목 없음',
            author: book.author ?? '',
            coverUrl: book.coverImageUrl ?? '',
            reviewId: undefined,
            content: '',
            createdAt: '',
            quoteContent: '',
            fromRental: true,
          });
        });
      } catch (e) {
        console.warn('렌탈 도서 추가 실패:', e);
      }

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
