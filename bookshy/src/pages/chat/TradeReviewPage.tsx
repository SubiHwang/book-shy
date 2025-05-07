import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Star } from 'lucide-react';

const TradeReviewPage = () => {
  const navigate = useNavigate();
  type RatingKey = 'condition' | 'punctuality' | 'manner';

  const [ratings, setRatings] = useState<Record<RatingKey, number>>({
    condition: 0,
    punctuality: 0,
    manner: 0,
  });

  const handleRating = (key: RatingKey, value: number) => {
    setRatings({ ...ratings, [key]: value });
  };

  const renderStars = (key: RatingKey) => {
    return [...Array(5)].map((_, i) => (
      <button key={i} onClick={() => handleRating(key, i + 1)}>
        <Star fill={i < ratings[key] ? '#E15F63' : 'none'} stroke="#E15F63" className="w-6 h-6" />
      </button>
    ));
  };

  return (
    <div className="min-h-screen bg-light-bg pb-8">
      {/* 상단 배경 영역 - 전체 너비 */}
      <div className="bg-[#FFEFE9] w-full pt-4 pb-6">
        <div className="px-4">
          <button className="text-gray-400 text-xl">×</button>

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
      </div>

      {/* 책 정보 영역 */}
      <div className="px-4">
        <div className="w-full bg-[#FFFEEC] mt-6 rounded-lg p-4">
          <p className="text-primary font-semibold mb-2">어떤 책을 교환하셨나요?</p>
          <p className="text-xs text-light-text-muted mb-3">
            거래한 도서를 남겨주시면 북끄북끄 서비스를 더 편리하게 즐기실 수 있습니다.
          </p>
          <div className="mb-2">
            <p className="text-sm font-medium">마이콜님 책</p>
            <label className="inline-flex items-center mr-4">
              <input type="checkbox" className="mr-1" /> 어린왕자
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="mr-1" /> 정의란 무엇인가?
            </label>
          </div>
          <div>
            <p className="text-sm font-medium">내 책</p>
            <label className="inline-flex items-center mr-4">
              <input type="checkbox" className="mr-1" /> 장발장
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="mr-1" /> 이기적 유전자
            </label>
          </div>
        </div>

        {/* 별점 평가 */}
        <div className="mt-6 w-full px-1">
          <div className="mb-4 text-center">
            <p className="font-medium mb-1">책 상태는 좋은가요?</p>
            <div className="flex justify-center gap-1">{renderStars('condition')}</div>
          </div>
          <div className="mb-4 text-center">
            <p className="font-medium mb-1">거래 시간을 잘 지켰나요?</p>
            <div className="flex justify-center gap-1">{renderStars('punctuality')}</div>
          </div>
          <div className="mb-6 text-center">
            <p className="font-medium mb-1">거래 매너는 좋았나요?</p>
            <div className="flex justify-center gap-1">{renderStars('manner')}</div>
          </div>

          <button
            onClick={() => navigate(-1)}
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
