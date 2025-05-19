// src/components/Mylibrary/BookShelf/BannerCards/BannerCard.tsx
import React from 'react';

interface BannerCardProps {
  backgroundColor: string; // 배경색 클래스 (예: 'bg-card-bg-pink')
  accentColor: string; // 강조 텍스트 색상 클래스 (예: 'text-primary')
  highlightedText: string; // 강조할 텍스트
  description?: string; // 설명 텍스트 (선택적)
  iconSrc: string; // 아이콘 이미지 경로
  iconAlt?: string; // 아이콘 대체 텍스트
  extraHighlightedText?: string; // 추가 강조 텍스트 (선택적)
  preText?: string; // 강조 텍스트 앞에 오는 텍스트
  midText?: string; // 두 강조 텍스트 사이에 오는 텍스트
  postText?: string; // 강조 텍스트 뒤에 오는 텍스트
}

const BannerCard: React.FC<BannerCardProps> = ({
  backgroundColor,
  accentColor,
  highlightedText,
  extraHighlightedText,
  description = '',
  iconSrc,
  iconAlt = '아이콘',
  preText = '',
  midText = '',
  postText = '',
}) => {
  return (
    <div
      className={`${backgroundColor} rounded-xl p-4 shadow transition-all duration-200 h-32 flex items-center relative overflow-visible`}
    >
      <div className="flex items-center w-full">
        <div className="flex-1 min-w-0 flex flex-col justify-center m-1">
          <p className="text-gray-800 font-semibold text-base mb-1 line-clamp-1">
            {preText && <>{preText} </>}
            <span className={accentColor}>{highlightedText}</span>
            {midText && <>{midText} </>}
            {extraHighlightedText && <span className={accentColor}>{extraHighlightedText}</span>}
            {postText && <> {postText}</>}
          </p>
          {description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-1 overflow-hidden">{description}</p>
          )}
        </div>
        <div className="ml-2 flex-shrink-0 w-22 h-22 flex items-center justify-center">
          <img src={iconSrc} alt={iconAlt} className="max-w-full max-h-full object-contain" />
        </div>
      </div>
    </div>
  );
};

export default BannerCard;
