import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { fetchBookNoteList } from '@/services/mybooknote/booknote/booknote';
import { fetchBookQuoteList } from '@/services/mybooknote/booknote/bookquote';
import { fetchUserAllLibrary } from '@/services/mylibrary/libraryApi';
import { fetchBookDetailByBookId } from '@/services/book/search';
import { fetchRentalBooksInUse } from '@/services/chat/chat';
import BookNoteSwiperPage from './BookNoteSwiperPage';
import LibraryBookListPage from './LibraryBookListPage';
import type { Book } from '@/types/book/book';
import Loading from '@/components/common/Loading';

const MyBookNotePage = () => {
  const { data: libraries = [], isLoading: isLoadingLib } = useQuery({
    queryKey: ['user-library'],
    queryFn: fetchUserAllLibrary,
  });

  const { data: notes = [], isLoading: isLoadingNotes } = useQuery({
    queryKey: ['my-booknotes'],
    queryFn: fetchBookNoteList,
  });

  const { data: quotes = [], isLoading: isLoadingQuotes } = useQuery({
    queryKey: ['my-bookquotes'],
    queryFn: fetchBookQuoteList,
  });

  const [enrichedBooks, setEnrichedBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const enrich = async () => {
      setLoading(true);
      try {
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

        // 렌탈 도서도 추가
        try {
          const rentalBooks = await fetchRentalBooksInUse();
          if (Array.isArray(rentalBooks) && rentalBooks.length > 0) {
            rentalBooks.forEach((book) => {
              if (book && book.bookId) {
                results.push({
                  libraryId: -1,
                  bookId: book.bookId,
                  title: book.title ?? '제목 없음',
                  author: book.author ?? '',
                  coverUrl: book.coverImageUrl ?? '',
                  reviewId: undefined,
                  content: '',
                  createdAt: '',
                  quoteContent: '',
                  fromRental: true,
                });
              }
            });
          }
        } catch (e) {
          console.warn('렌탈 도서 정보 가져오기 실패:', e);
        }

        setEnrichedBooks(results);
        setError(null);
      } catch (e) {
        console.error('도서 목록 가공 실패:', e);
        setError('도서 정보를 불러오는 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (notes.length > 0) {
      enrich();
    } else {
      setLoading(false);
    }
  }, [notes, quotes, libraries]);

  // ✅ 로딩 상태
  if (loading || isLoadingLib || isLoadingNotes || isLoadingQuotes) {
    return <Loading loadingText="독서 기록을 불러오는 중..." />;
  }

  // ❌ 에러 발생 시
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-[#FCF6D4] to-[#F4E8B8]">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  // ✅ 조건에 따라 페이지 렌더링
  return enrichedBooks.length > 0 ? (
    <BookNoteSwiperPage bookNotes={enrichedBooks} />
  ) : (
    <LibraryBookListPage />
  );
};

export default MyBookNotePage;
