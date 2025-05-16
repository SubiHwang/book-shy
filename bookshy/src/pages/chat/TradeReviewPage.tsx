import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Star } from 'lucide-react';

// ⭐️ 별점 컴포넌트
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

  const [ratings, setRatings] = useState({
    condition: 0,
    punctuality: 0,
    manner: 0,
  });

  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);

  const toggleBook = (book: string) => {
    setSelectedBooks((prev) =>
      prev.includes(book) ? prev.filter((b) => b !== book) : [...prev, book],
    );
  };

  const handleSubmit = () => {
    if (Object.values(ratings).some((v) => v === 0)) {
      alert('모든 항목을 평가해주세요.');
      return;
    }
    console.log('📦 제출 데이터:', { ratings, selectedBooks });
    navigate(-1); // 제출 후 뒤로 이동
  };

  return (
    <div className="min-h-screen bg-light-bg pb-8">
      {/* 🔺 상단 영역 */}
      <div className="bg-[#FFEFE9] w-full pt-4 pb-6 px-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 text-xl">
          ×
        </button>
        <div className="mt-4 text-center">
          <img
            src="https://cdn.bookshy.com/profile/user5.jpg"
            alt="profile"
            className="w-20 h-20 rounded-full mx-auto mb-2"
          />
          <p className="text-lg font-semibold">마이콜 님과의 거래는 어떠셨나요?</p>
          <p className="text-sm text-light-text-muted mt-1">
            정직한 평가가 더 좋은 북끄북끄 문화를 만듭니다
          </p>
        </div>
      </div>

      {/* 📚 책 정보 선택 */}
      <div className="px-4">
        <div className="bg-[#FFFEEC] mt-6 rounded-lg p-4">
          <p className="text-primary font-semibold mb-2">어떤 책을 교환하셨나요?</p>
          <p className="text-xs text-light-text-muted mb-3">
            거래한 도서를 남겨주시면 북끄북끄 서비스를 더 편리하게 즐기실 수 있습니다.
          </p>

          <div className="mb-2">
            <p className="text-sm font-medium">마이콜님 책</p>
            {['어린왕자', '정의란 무엇인가?'].map((book) => (
              <label key={book} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={selectedBooks.includes(book)}
                  onChange={() => toggleBook(book)}
                  className="mr-1"
                />
                {book}
              </label>
            ))}
          </div>

          <div>
            <p className="text-sm font-medium">내 책</p>
            {['장발장', '이기적 유전자'].map((book) => (
              <label key={book} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={selectedBooks.includes(book)}
                  onChange={() => toggleBook(book)}
                  className="mr-1"
                />
                {book}
              </label>
            ))}
          </div>
        </div>

        {/* ⭐️ 별점 영역 */}
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
            className="w-full bg-primary text-white py-2 rounded-lg text-sm font-semibold"
          >
            평가 보내기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeReviewPage;
