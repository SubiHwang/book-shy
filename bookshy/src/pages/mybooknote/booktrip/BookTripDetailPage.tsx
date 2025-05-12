import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchBookTripsByBookId } from '@/services/mybooknote/booktrip/booktrip';
import { fetchBookDetailByBookId } from '@/services/book/search';
import type { BookTripWithUser } from '@/types/mybooknote/booktrip/booktrip';
import type { Book } from '@/types/book/book';
import BookNoteHeaderCard from '@/components/mybooknote/booknote/BookNoteHeaderCard';
import Header from '@/components/common/Header';
import { useState } from 'react';

const BookTripDetailPage = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [myContent, setMyContent] = useState('');

  const { data: trips = [], isLoading: isTripsLoading } = useQuery<BookTripWithUser[]>({
    queryKey: ['bookTrips', bookId],
    queryFn: () => fetchBookTripsByBookId(Number(bookId)),
    enabled: !!bookId,
  });

  const { data: bookInfo, isLoading: isBookLoading } = useQuery<Book>({
    queryKey: ['bookInfo', bookId],
    queryFn: () => fetchBookDetailByBookId(Number(bookId)),
    enabled: !!bookId,
  });

  const myTrip = trips.find((trip) => trip.isMine);
  const otherTrips = trips.filter((trip) => !trip.isMine);

  if (isTripsLoading || isBookLoading) {
    return <p className="text-center py-12 text-gray-500">로딩 중입니다...</p>;
  }

  return (
    <div className="bg-[#f9f4ec] min-h-screen pb-28">
      <Header title="독서 기록" showBackButton showNotification />
      <div className="px-4 py-4">
        {bookInfo?.title && bookInfo?.author && bookInfo?.publisher && (
          <BookNoteHeaderCard
            title={bookInfo.title}
            author={bookInfo.author}
            publisher={bookInfo.publisher}
            coverUrl={bookInfo.coverImageUrl}
          />
        )}

        <h3 className="text-base font-semibold mb-4">책의 여정 살펴보기</h3>

        <div className="flex flex-col gap-3">
          {otherTrips.map((trip) => (
            <div key={trip.tripId} className="flex items-start gap-2">
              <img
                src={trip.userProfile.profileImageUrl || '/avatars/default.png'}
                className="w-8 h-8 rounded-full"
                alt={trip.userProfile.nickname}
              />
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  {trip.userProfile.nickname} 님의 한 마디 ·{' '}
                  {new Date(trip.createdAt).toLocaleString()}
                </p>
                <div className="bg-white px-4 py-2 rounded-md shadow-sm max-w-[80%] text-sm">
                  {trip.content}
                </div>
              </div>
            </div>
          ))}

          {myTrip ? (
            <div className="flex items-start justify-end gap-2">
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">
                  나의 한 마디 · {new Date(myTrip.createdAt).toLocaleString()}
                </p>
                <div className="bg-white px-4 py-2 rounded-md shadow-sm max-w-[80%] text-sm inline-block">
                  {myTrip.content}
                </div>
                <div className="flex justify-end gap-2 mt-1">
                  <button className="text-xs text-gray-500 border px-2 py-1 rounded-md">
                    삭제하기
                  </button>
                  <button className="text-xs text-white bg-primary px-2 py-1 rounded-md">
                    수정하기
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 items-start mt-4">
              <img src="/avatars/me.png" className="w-8 h-8 rounded-full" />
              <div className="flex-1">
                <textarea
                  placeholder="0/1000"
                  maxLength={1000}
                  value={myContent}
                  onChange={(e) => setMyContent(e.target.value)}
                  className="w-full bg-white rounded-md shadow-sm px-3 py-2 text-sm resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button className="text-white bg-primary px-4 py-2 rounded-md text-sm">
                    작성하기
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookTripDetailPage;
