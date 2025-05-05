import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface ReadingNote {
  id: number;
  content: string;
  createdAt: string;
  page?: number;
}

const BookNotesTab: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [notes, setNotes] = useState<ReadingNote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 데이터 가져오기
    const fetchReadingNotes = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // 실제 API 호출로 대체 필요
        setTimeout(() => {
          // 임시로 빈 배열 반환 (독서 노트 없음)
          setNotes([]);
          setLoading(false);
        }, 300);
      } catch (error) {
        console.error('독서 기록을 가져오는 중 오류 발생:', error);
        setLoading(false);
      }
    };

    fetchReadingNotes();
  }, [id]);

  const handleAddNote = () => {
    // 독서 기록 추가 페이지로 이동하거나 모달 열기
    alert('독서 기록 추가 기능은 아직 구현되지 않았습니다.');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <div className="text-center my-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-300 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-center text-gray-500 mb-2">독서 기록이 없습니다</p>
          <p className="text-center text-gray-400 text-sm mb-6">
            책을 읽으면서 느낀 점이나 기억하고 싶은 문장을 기록해보세요.
          </p>
        </div>
        <button
          className="bg-primary-light text-white rounded-md py-2 px-6 shadow-md hover:bg-primary-dark transition-colors"
          onClick={handleAddNote}
        >
          독서 기록 추가하기
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">나의 독서 기록</h3>
        <button
          className="text-sm text-primary-light hover:text-primary-dark"
          onClick={handleAddNote}
        >
          + 새 기록 추가
        </button>
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>{note.createdAt}</span>
              {note.page && <span>p.{note.page}</span>}
            </div>
            <p className="text-light-text">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookNotesTab;
