// src/components/mylibrary/AddBookDialog.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AddBookDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddBookDialog: React.FC<AddBookDialogProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // 다이얼로그가 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  // 각 옵션 선택 시 처리 함수
  const handleTitleRecognition = () => {
    navigate('/my-library/add-by-title');
    onClose();
  };

  const handleISBNRecognition = () => {
    navigate('/my-library/add-by-isbn');
    onClose();
  };

  const handleManualSearch = () => {
    navigate('/my-library/search');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 어두운 배경 오버레이 */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      {/* 바텀 시트 컨테이너 */}
      <div className="fixed bottom-0 inset-x-0 z-10">
        <div className="transform transition-all">
          <div className="bg-white rounded-t-xl shadow-xl w-full">
            {/* 다이얼로그 헤더 */}
            <div className="px-6 pt-6 pb-4 text-center">
              <h3 className="text-xl font-medium text-gray-900">책 등록 방식 선택</h3>
            </div>

            {/* 옵션 버튼들 */}
            <div className="px-6 py-4 space-y-4">
              {/* 제목 인식 버튼 */}
              <button
                onClick={handleTitleRecognition}
                className="w-full py-3 px-4 rounded-md bg-primary-light text-white font-medium text-lg hover:bg-primary-accent transition-colors"
              >
                제목 인식
              </button>

              {/* ISBN 인식 버튼 */}
              <button
                onClick={handleISBNRecognition}
                className="w-full py-3 px-4 rounded-md bg-primary-light text-white font-medium text-lg hover:bg-primary-accent transition-colors"
              >
                ISBN 인식
              </button>

              {/* 직접 검색 버튼 */}
              <button
                onClick={handleManualSearch}
                className="w-full py-3 px-4 rounded-md bg-primary-light text-white font-medium text-lg hover:bg-primary-accent transition-colors"
              >
                직접 검색하기
              </button>
            </div>

            {/* 하단 여백 - 모바일 친화적인 느낌을 위해 */}
            <div className="h-6 bg-white"></div>
            {/* 아이폰 하단 홈 인디케이터 영역을 위한 안전 마진 */}
            <div className="h-6 bg-white safe-bottom"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBookDialog;
