import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const TradeCompletedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] text-center px-4">
      <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
      <h1 className="text-xl font-semibold mb-2">교환이 완료되었습니다 🎉</h1>
      <p className="text-gray-600 text-sm mb-6">
        상대방과의 도서 교환이 성공적으로 마무리되었어요.
        <br />
        교환된 책은 자동으로 서재에 반영됩니다.
      </p>
      <button
        className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium"
        onClick={() => navigate('/bookshelf')}
      >
        내 서재로 이동
      </button>
    </div>
  );
};

export default TradeCompletedPage;
