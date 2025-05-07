import React, { useState } from 'react';

interface BookCardProps {
  title: string;
  coverUrl: string;
  quoteContent?: string;
  reviewContent?: string;
  author?: string;
}

const BookCard: React.FC<BookCardProps> = ({
  title,
  coverUrl,
  quoteContent,
  reviewContent,
  author,
}) => {
  const [viewStage, setViewStage] = useState<'cover' | 'quote' | 'review'>('cover');

  const handleClick = () => {
    setViewStage((prev) => (prev === 'cover' ? 'quote' : prev === 'quote' ? 'review' : 'cover'));
  };

  return (
    <div
      className="relative w-[140px] h-[210px] bg-white rounded-2xl shadow overflow-hidden"
      onClick={handleClick}
    >
      {viewStage === 'cover' && (
        <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
      )}

      {viewStage === 'quote' && quoteContent && (
        <div className="w-full h-full bg-black/60 text-white flex flex-col justify-center items-center px-4 text-center">
          <p className="text-[10px] mb-1">{author}</p>
          <h3 className="font-semibold text-xs mb-2">{title} 중에서</h3>
          <p className="text-xs leading-tight">{quoteContent}</p>
        </div>
      )}

      {viewStage === 'review' && reviewContent && (
        <div className="w-full h-full bg-black/70 text-white flex flex-col justify-center items-center px-4 text-center">
          <h3 className="font-semibold text-sm mb-2">{title}</h3>
          <p className="text-xs leading-tight line-clamp-6">{reviewContent}</p>
          <p className="text-xs text-right mt-2 w-full">더 보기 →</p>
        </div>
      )}
    </div>
  );
};

export default BookCard;
