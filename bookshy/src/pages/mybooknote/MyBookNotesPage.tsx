import { useQuery } from '@tanstack/react-query';
import Header from '@/components/common/Header';
import TabNavBar from '@/components/common/TabNavBar';
import { useNavigate } from 'react-router-dom';
import { fetchBookNotes } from '@/services/booknote/booknote';
import type { BookNote } from '@/types/booknote';

const MyBookNotesPage = () => {
  const navigate = useNavigate();
  const { data = [], isLoading } = useQuery<BookNote[]>({
    queryKey: ['my-booknotes'],
    queryFn: fetchBookNotes,
  });

  const pages = [
    { path: '/booknotes', label: '내 독서 기록 보기' },
    { path: '/booknotes/plan', label: '책의 여정 보기' },
  ];

  return (
    <div className="bg-light-bg min-h-screen flex flex-col">
      <Header title="독서 기록" onBackClick={() => navigate(-1)} showBackButton showNotification />

      <div className="px-4 mt-2">
        <div className="flex items-center border-b border-gray-200 mb-4">
          {pages.map(({ path, label }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex-1 pb-2 text-center font-semibold ${
                location.pathname === path
                  ? 'text-pink-500 border-b-2 border-pink-500'
                  : 'text-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <h2 className="text-base font-semibold mb-1">독서 기록 카드 보기</h2>
        <p className="text-sm text-gray-500 mb-4">나의 독서 기록을 모아보세요.</p>

        {isLoading ? (
          <p>불러오는 중...</p>
        ) : data.length === 0 ? (
          <div className="text-center mt-20 text-gray-400 text-sm">
            <p>아직 작성된 나의 독서 기록이 없어요!</p>
            <p>작성하기 버튼을 눌러 독서 기록을 남겨보아요.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((note) => (
              <div
                key={note.bookId}
                className="flex items-center p-3 bg-white rounded-xl shadow-sm"
              >
                <img
                  src={note.coverUrl}
                  alt={note.title}
                  className="w-12 h-16 rounded-md object-cover mr-4"
                />
                <div className="flex-1">
                  <p className="font-semibold">{note.title}</p>
                  <p className="text-xs text-gray-500">작가: {note.author}</p>
                  <p className="text-xs text-gray-500">출판: {note.publisher}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 우측 하단 플로팅 버튼 */}
      <button
        onClick={() => navigate('/booknotes/create')}
        className="fixed bottom-20 right-6 w-12 h-12 bg-pink-500 text-white rounded-full shadow-lg text-2xl"
      >
        +
      </button>

      <TabNavBar pages={pages} />
    </div>
  );
};

export default MyBookNotesPage;
