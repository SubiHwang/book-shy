import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchBookTripsByBookId } from '@/services/mybooknote/booktrip/booktrip';
import type { BookTrip } from '@/types/mybooknote/booktrip/booktrip';
import BookNoteHeaderCard from '@/components/mybooknote/booknote/BookNoteHeaderCard';
import Header from '@/components/common/Header';
import { useState } from 'react';

const mockBookInfo = {
  title: '어린왕자',
  author: '생텍쥐페리',
  publisher: '더스토리북',
  coverImageUrl: 'https://image.aladin.co.kr/product/36321/12/coversum/k672038544_1.jpg',
};

const currentUserId = 1; // ✅ 임시: 실제론 로그인 유저 ID 추출 필요

const BookTripDetailPage = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [myContent, setMyContent] = useState('');

  const { data: trips = [], isLoading } = useQuery<BookTrip[]>({
    queryKey: ['bookTrips', bookId],
    queryFn: () => fetchBookTripsByBookId(Number(bookId)),
  });

  const myTrip = trips.find((trip) => trip.userId === currentUserId);
  const otherTrips = trips.filter((trip) => trip.userId !== currentUserId);

  return (
    <div className="bg-[#f9f4ec] min-h-screen pb-28">
      <Header title="독서 기록" showBackButton showNotification />
      <div className="px-4 py-4">
        <BookNoteHeaderCard
          title={mockBookInfo.title}
          author={mockBookInfo.author}
          publisher={mockBookInfo.publisher}
          coverUrl={mockBookInfo.coverImageUrl}
        />

        <h3 className="text-base font-semibold mb-4">책의 여정 살펴보기</h3>

        <div className="flex flex-col gap-3">
          {otherTrips.map((trip) => (
            <div key={trip.tripId} className="flex items-start gap-2">
              <img
                src={`/avatars/user${trip.userId}.png`} // ⛔ 예시용
                className="w-8 h-8 rounded-full"
                alt="user"
              />
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  유저 {trip.userId} 님의 한 마디 · {new Date(trip.createdAt).toLocaleString()}
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
