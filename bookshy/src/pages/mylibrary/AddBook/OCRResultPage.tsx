import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import Header from '@/components/common/Header'; // Header 컴포넌트 import

const OcrResultPage: React.FC = () => {
  const navigate = useNavigate();

  const imageDataUrl = useSelector((state: RootState) => state.ocr.imageDataUrl);
  const textList = useSelector((state: RootState) => state.ocr.textList);

  const handleTextClick = (text: string) => {
    navigate(`/bookshelf/search/${encodeURIComponent(text)}`);
  };

  // 뒤로가기 처리
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header 컴포넌트 적용 */}
      <Header
        title="OCR 결과 확인"
        onBackClick={handleBackClick}
        showBackButton={true}
        showNotification={false}
        className="bg-white"
      />

      <div className="p-4 flex-1">
        {imageDataUrl && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">📸 캡처한 이미지</p>
            <img src={imageDataUrl} alt="Captured" className="w-full rounded-lg shadow" />
          </div>
        )}

        <div>
          <p className="text-sm text-gray-500 mb-2">🔠 인식된 텍스트</p>
          {textList.length > 0 ? (
            <ul className="space-y-2">
              {textList.map((text, index) => (
                <li
                  key={index}
                  className="p-3 bg-white rounded-md shadow hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => handleTextClick(text)}
                >
                  {text}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">인식된 텍스트가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OcrResultPage;
