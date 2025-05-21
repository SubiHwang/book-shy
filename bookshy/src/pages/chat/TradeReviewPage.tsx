import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchUserPublicLibrary } from '@/services/mylibrary/libraryApi';
import { fetchBookDetailByBookId } from '@/services/book/search';
import { fetchScheduleByRoomId, fetchChatRoomUserIds } from '@/services/chat/chat';
import { submitTradeReview, checkReviewStatus } from '@/services/chat/trade';
import { getUserIdFromToken } from '@/utils/jwt';

import type { Library } from '@/types/mylibrary/library';
import type { ChatCalendarEventDto } from '@/types/chat/chat';
import type { ReviewStatusResponse } from '@/types/chat/trade';

import StarRating from '@/components/chat/tradereview/StarRating';
import BookSelector from '@/components/chat/tradereview/BookSelector';
import BookModal from '@/components/chat/tradereview/BookModal';
import { toast } from 'react-toastify';

const TradeReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    chatSummary?: {
      roomId: number;
      partnerName: string;
      partnerProfileImage: string;
      bookShyScore?: number;
      myBookId?: number[];
      myBookName?: string[];
      otherBookId?: number[];
      otherBookName?: string[];
    };
  };

  const [calendar, setCalendar] = useState<ChatCalendarEventDto | null>(null);
  const [ratings, setRatings] = useState({ condition: 0, punctuality: 0, manner: 0 });
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [myLibraryBooks, setMyLibraryBooks] = useState<Library[]>([]);
  const [defaultBooks, setDefaultBooks] = useState<Library[]>([]);
  const [showMyLibrary, setShowMyLibrary] = useState(false);
  const [activeBook, setActiveBook] = useState<Library | null>(null);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<ReviewStatusResponse['reviewStatus'] | null>(
    null,
  );

  const {
    roomId,
    partnerName,
    partnerProfileImage,
    myBookId = [],
    myBookName = [],
  } = state?.chatSummary || {};

  // 매칭 당시 책들을 제외한 서재 책들
  const defaultBookIds = defaultBooks.map((book) => book.bookId);
  const filteredMyLibraryBooks = myLibraryBooks.filter(
    (book) => !defaultBookIds.includes(book.bookId),
  );

  // 캘린더 일정 불러오기
  useEffect(() => {
    if (!roomId) {
      toast.error('유효하지 않은 접근입니다.');
      navigate(-1);
      return;
    }

    // 공개 서재 불러오기
    fetchUserPublicLibrary().then(setMyLibraryBooks).catch(console.error);

    // 캘린더 일정 불러오기
    fetchScheduleByRoomId(roomId)
      .then((calendarData) => {
        console.log('캘린더 데이터 로드:', calendarData);
        setCalendar(calendarData);
      })
      .catch((err) => {
        console.error(err);
        toast.error('거래 일정을 불러올 수 없습니다.');
        navigate(-1);
      });
  }, [roomId]);

  // calendar가 로드된 후에 리뷰 상태 확인
  useEffect(() => {
    if (!calendar?.requestId || !roomId) {
      console.log('calendar 또는 requestId가 없음:', calendar);
      return;
    }

    const checkUserReviewStatus = async () => {
      try {
        console.log('리뷰 상태 확인 시작:', { roomId, requestId: calendar.requestId });
        const response = await checkReviewStatus(roomId, calendar.requestId);
        console.log('리뷰 상태 확인 결과:', response);

        if (!response) {
          console.error('리뷰 상태 응답이 없음');
          return;
        }

        const { hasReviewed, reviewStatus } = response;
        console.log('리뷰 상태 파싱:', { hasReviewed, reviewStatus });

        setHasSubmittedReview(hasReviewed);
        setReviewStatus(reviewStatus);

        if (hasReviewed) {
          // 이미 리뷰를 작성한 경우, 상대방 리뷰 상태에 따라 다른 메시지 표시
          const partnerHasSubmitted = reviewStatus.partnerReview.hasSubmitted;
          if (partnerHasSubmitted) {
            toast.info('양측 모두 리뷰를 작성했습니다. 거래가 곧 완료됩니다.');
          } else {
            toast.info('상대방이 아직 리뷰를 작성하지 않았습니다.');
          }
        }
      } catch (e) {
        console.error('리뷰 상태 확인 실패:', e);
      }
    };

    checkUserReviewStatus();
  }, [calendar, roomId]);

  useEffect(() => {
    // 매칭 당시 책 정보를 불러오기
    const fetchBooks = async () => {
      const books: Library[] = await Promise.all(
        myBookId.map(async (id, idx) => {
          try {
            const detail = await fetchBookDetailByBookId(id);
            return {
              libraryId: -id,
              bookId: id,
              aladinItemId: detail.itemId ?? -1,
              title: detail.title ?? myBookName[idx],
              author: detail.author ?? '',
              publisher: detail.publisher ?? '',
              isbn13: detail.isbn13 ?? '',
              coverImageUrl: detail.coverImageUrl ?? '',
              public: false,
            };
          } catch (e) {
            console.log(e);
            return {
              libraryId: -id,
              bookId: id,
              aladinItemId: -1,
              title: myBookName[idx] ?? '제목 없음',
              author: '',
              publisher: '',
              isbn13: '',
              coverImageUrl: '',
              public: false,
            };
          }
        }),
      );
      setDefaultBooks(books);
    };

    fetchBooks();
  }, [myBookId, myBookName]);

  useEffect(() => {
    document.body.style.overflow = activeBook ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [activeBook]);

  const toggleBook = (title: string) => {
    setSelectedBooks((prev) =>
      prev.includes(title) ? prev.filter((b) => b !== title) : [...prev, title],
    );
  };

  const handleSubmit = async () => {
    if (!calendar) {
      toast.warn('일정 정보가 없습니다.');
      return;
    }

    if (Object.values(ratings).some((v) => v === 0)) {
      toast.warn('모든 항목을 평가해주세요.');
      return;
    }

    // 책 정보 구성
    const allBooks = [...defaultBooks, ...filteredMyLibraryBooks];
    const selectedReviewedBooks = allBooks
      .filter((book) => selectedBooks.includes(book.title))
      .map((book) => ({
        title: book.title,
        bookId: book.bookId,
        libraryId: book.libraryId,
        aladinItemId: book.aladinItemId,
        fromMatching: defaultBooks.some((b) => b.title === book.title),
      }));

    // 참여자 ID 가져오기
    let userIds: number[] = [];
    try {
      const { userAId, userBId } = await fetchChatRoomUserIds(roomId!);
      userIds = [userAId, userBId];
    } catch (e) {
      console.log(e);
      return;
    }

    const payload = {
      requestId: calendar.requestId,
      userIds,
      rating: (ratings.condition + ratings.punctuality + ratings.manner) / 3,
      ratings,
      books: selectedReviewedBooks,
    };

    try {
      const { isTradeCompleted } = await submitTradeReview(payload);
      toast.success('리뷰가 성공적으로 제출되었습니다!');

      // ✅ 거래가 최종 완료된 경우 → 완료 페이지로 이동
      if (isTradeCompleted) {
        navigate('/exchange/completed');
      } else {
        // 상대방 리뷰 대기 중
        navigate(-1);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!state?.chatSummary) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-gray-500 px-4">
        <div>
          <p className="text-lg font-semibold mb-2">잘못된 접근입니다.</p>
          <p className="text-sm mb-4">리뷰 정보를 불러올 수 없습니다.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (hasSubmittedReview) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-gray-500 px-4">
        <div>
          <p className="text-lg font-semibold mb-2">이미 리뷰를 작성하셨습니다.</p>
          <p className="text-sm mb-4">
            {reviewStatus?.partnerReview?.hasSubmitted
              ? '양측 모두 리뷰를 작성했습니다. 거래가 곧 완료됩니다.'
              : '상대방이 아직 리뷰를 작성하지 않았습니다.'}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm"
          >
            채팅방으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg pb-8 relative">
      {/* 프로필 영역 */}
      <div className="bg-[#FFEFE9] w-full pt-4 pb-6 px-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 text-xl">
          ×
        </button>
        <div className="mt-4 text-center">
          <img
            src={partnerProfileImage}
            alt="profile"
            className="w-20 h-20 rounded-full mx-auto mb-2"
          />
          <p className="text-lg font-semibold">{partnerName} 님과의 거래는 어떠셨나요?</p>
          <p className="text-sm text-light-text-muted mt-1">
            정직한 평가가 더 좋은 북끄북끄 문화를 만듭니다
          </p>
        </div>
      </div>

      {/* 책 선택 + 별점 영역 */}
      <div className="px-4">
        <BookSelector
          selectedBooks={selectedBooks}
          toggleBook={toggleBook}
          showMyLibrary={showMyLibrary}
          setShowMyLibrary={setShowMyLibrary}
          myLibraryBooks={filteredMyLibraryBooks}
          onViewDetail={setActiveBook}
          defaultBooks={defaultBooks}
        />

        <div className="mt-6 px-1">
          <StarRating
            label="책 상태는 좋은가요?"
            value={ratings.condition}
            onChange={(val) => setRatings({ ...ratings, condition: val })}
          />
          <StarRating
            label="거래 시간을 잘 지켰나요?"
            value={ratings.punctuality}
            onChange={(val) => setRatings({ ...ratings, punctuality: val })}
          />
          <StarRating
            label="거래 매너는 좋았나요?"
            value={ratings.manner}
            onChange={(val) => setRatings({ ...ratings, manner: val })}
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-white py-2 rounded-lg text-sm font-semibold mt-4"
          >
            평가 보내기
          </button>
        </div>
      </div>

      {/* 상세 모달 */}
      {activeBook && <BookModal book={activeBook} onClose={() => setActiveBook(null)} />}
    </div>
  );
};

export default TradeReviewPage;
