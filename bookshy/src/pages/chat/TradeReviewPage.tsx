import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star } from 'lucide-react';
import { fetchUserPublicLibrary } from '@/services/mylibrary/libraryApi';
import type { ChatRoomSummary } from '@/types/chat/chat';
import type { Library } from '@/types/mylibrary/library';

// ⭐️ 별점 컴포넌트는 동일하게 유지
const StarRating = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
}) => (
  <div className="mb-4 text-center">
    <p className="font-medium mb-1">{label}</p>
    <div className="flex justify-center gap-1">
      {[...Array(5)].map((_, i) => (
        <button key={i} onClick={() => onChange(i + 1)}>
          <Star fill={i < value ? '#E15F63' : 'none'} stroke="#E15F63" className="w-6 h-6" />
        </button>
      ))}
    </div>
  </div>
);

const TradeReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location as { state: { chatSummary: ChatRoomSummary } };

  const [ratings, setRatings] = useState({ condition: 0, punctuality: 0, manner: 0 });
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [myLibraryBooks, setMyLibraryBooks] = useState<Library[]>([]);
  const [showMyLibrary, setShowMyLibrary] = useState(false);

  const toggleBook = (bookTitle: string) => {
    setSelectedBooks((prev) =>
      prev.includes(bookTitle) ? prev.filter((b) => b !== bookTitle) : [...prev, bookTitle],
    );
  };

  useEffect(() => {
    fetchUserPublicLibrary().then(setMyLibraryBooks).catch(console.error);
  }, []);

  const handleSubmit = () => {
    if (Object.values(ratings).some((v) => v === 0)) {
      alert('모든 항목을 평가해주세요.');
      return;
    }
    console.log('📝 제출 데이터:', { ratings, selectedBooks });
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-light-bg pb-8">
      {/* 상단 프로필 영역 */}
      <div className="bg-[#FFEFE9] w-full pt-4 pb-6 px-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 text-xl">
          ×
        </button>
        <div className="mt-4 text-center">
          <img
            src={state.chatSummary.partnerProfileImage}
            alt="profile"
            className="w-20 h-20 rounded-full mx-auto mb-2"
          />
          <p className="text-lg font-semibold">
            {state.chatSummary.partnerName} 님과의 거래는 어떠셨나요?
          </p>
          <p className="text-sm text-light-text-muted mt-1">
            정직한 평가가 더 좋은 북끄북끄 문화를 만듭니다
          </p>
        </div>
      </div>

      {/* 책 교환 영역 */}
      <div className="px-4">
        <div className="bg-[#FFFEEC] mt-6 rounded-lg p-4">
          <p className="text-primary font-semibold mb-2">어떤 책을 교환하셨나요?</p>
          <p className="text-xs text-light-text-muted mb-3">
            거래한 도서를 남겨주시면 북끄북끄 서비스를 더 편리하게 즐기실 수 있습니다.
          </p>

          <div className="mb-2">
            <p className="text-sm font-medium">{state.chatSummary.partnerName}님 책</p>
            <label className="inline-flex items-center mr-4">
              <input type="checkbox" className="mr-1" onChange={() => toggleBook('어린왕자')} />
              어린왕자
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="mr-1"
                onChange={() => toggleBook('정의란 무엇인가?')}
              />
              정의란 무엇인가?
            </label>
          </div>

          <div className="mb-2">
            <p className="text-sm font-medium">내 책</p>
            <label className="inline-flex items-center mr-4">
              <input type="checkbox" className="mr-1" onChange={() => toggleBook('장발장')} />
              장발장
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="mr-1"
                onChange={() => toggleBook('이기적 유전자')}
              />
              이기적 유전자
            </label>
          </div>

          {/* 내 서재 책 펼치기 */}
          <div className="mt-4">
            <label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
              <input type="checkbox" onChange={(e) => setShowMyLibrary(e.target.checked)} />
              매칭 목록 이외에 교환하셨나요?
            </label>
            {showMyLibrary && (
              <div className="mt-2 flex flex-wrap gap-2">
                {myLibraryBooks.map((book) => (
                  <button
                    key={book.libraryId}
                    onClick={() => toggleBook(book.title)}
                    className={`border px-3 py-1 rounded-full text-sm ${
                      selectedBooks.includes(book.title)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    {book.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

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
    </div>
  );
};

export default TradeReviewPage;
