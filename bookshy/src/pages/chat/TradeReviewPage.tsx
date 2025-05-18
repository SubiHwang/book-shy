import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchUserPublicLibrary } from '@/services/mylibrary/libraryApi';
import type { Library } from '@/types/mylibrary/library';

import StarRating from '@/components/chat/tradereview/StarRating';
import BookSelector from '@/components/chat/tradereview/BookSelector';
import BookModal from '@/components/chat/tradereview/BookModal';

const TradeReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    chatSummary?: {
      partnerName: string;
      partnerProfileImage: string;
      bookShyScore?: number;
      myBookId?: number[];
      myBookName?: string[];
      otherBookId?: number[];
      otherBookName?: string[];
    };
  };

  console.log(state.chatSummary);

  const [ratings, setRatings] = useState({ condition: 0, punctuality: 0, manner: 0 });
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [myLibraryBooks, setMyLibraryBooks] = useState<Library[]>([]);
  const [showMyLibrary, setShowMyLibrary] = useState(false);
  const [activeBook, setActiveBook] = useState<Library | null>(null);

  useEffect(() => {
    fetchUserPublicLibrary().then(setMyLibraryBooks).catch(console.error);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeBook ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [activeBook]);

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

  const { partnerName, partnerProfileImage, myBookId = [], myBookName = [] } = state.chatSummary;

  const toggleBook = (title: string) => {
    setSelectedBooks((prev) =>
      prev.includes(title) ? prev.filter((b) => b !== title) : [...prev, title],
    );
  };

  const handleSubmit = () => {
    if (Object.values(ratings).some((v) => v === 0)) {
      alert('모든 항목을 평가해주세요.');
      return;
    }
    console.log('📝 제출 데이터:', {
      ratings,
      selectedBookTitles: selectedBooks,
    });
    navigate(-1);
  };

  const defaultBooks: Library[] =
    myBookId.length === myBookName.length
      ? myBookId.map((id, idx) => ({
          libraryId: -id,
          bookId: id,
          aladinItemId: -id,
          public: false,
          title: myBookName[idx],
          author: '',
          isbn13: '',
          coverImageUrl: '', // 개선 여지
        }))
      : [];

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

      {/* 책 선택 영역 */}
      <div className="px-4">
        <BookSelector
          selectedBooks={selectedBooks}
          toggleBook={toggleBook}
          showMyLibrary={showMyLibrary}
          setShowMyLibrary={setShowMyLibrary}
          myLibraryBooks={myLibraryBooks}
          onViewDetail={setActiveBook}
          defaultBooks={defaultBooks}
        />

        {/* 별점 영역 */}
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
