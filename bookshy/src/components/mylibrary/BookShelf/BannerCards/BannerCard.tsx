// src/components/Mylibrary/BookShelf/BannerCards/BannerCard.tsx
import React from 'react';

interface BannerCardProps {
  backgroundColor: string;
  accentColor: string;
  highlightedText: string;
  description?: string;
  iconSrc: string;
  iconAlt?: string;
  extraHighlightedText?: string;
  preText?: string;
  midText?: string;
  postText?: string;
  descriptionPrefix?: string;
}

const BannerCard: React.FC<BannerCardProps> = ({
  backgroundColor,
  accentColor,
  highlightedText,
  description = '',
  iconSrc,
  iconAlt = '아이콘',
  preText = '',
  postText = '',
  descriptionPrefix = '',
}) => {
  return (
    <div
      className={`${backgroundColor} rounded-xl p-4 shadow transition-all duration-200 h-32 flex items-center relative overflow-visible`}
    >
      <div className="flex items-center w-full">
        <div className="flex-1 min-w-0 flex flex-col justify-center m-1 ml-3">
          <p className="text-gray-800 font-semibold text-base mb-1 line-clamp-1">
            {preText && <>{preText} </>}
            <span className={accentColor}>{highlightedText}</span>
            {/* 조사와 띄어쓰기 없이 바로 연결 */}
            {postText && <>{postText}</>}
          </p>
          {description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 overflow-hidden whitespace-pre-line">
              {descriptionPrefix && <span className="mr-1">{descriptionPrefix}</span>}
              {description}
            </p>
          )}
        </div>
        <div className=" flex-shrink-0 w-14 h-14 flex items-center justify-center mr-2">
          <img src={iconSrc} alt={iconAlt} className="max-w-full max-h-full object-contain" />
        </div>
      </div>
    </div>
  );
};

export default BannerCard;
