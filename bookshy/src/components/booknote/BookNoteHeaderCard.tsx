import React from 'react';

interface BookNoteHeaderCardProps {
  coverUrl?: string;
  title: string;
  author?: string;
  publisher?: string;
  badgeText?: string;
}

const BookNoteHeaderCard: React.FC<BookNoteHeaderCardProps> = ({
  coverUrl,
  title,
  author,
  publisher,
  badgeText,
}) => {
  return (
    <div className="flex items-start gap-4 bg-[#f9f4ec] mb-4">
      <div className="relative">
        <img
          src={coverUrl || '/placeholder.jpg'}
          alt={title}
          className="w-24 h-32 rounded-md object-cover shadow"
        />
        {badgeText && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-14px] bg-[#5a524d] text-white text-xs px-2 py-0.5 rounded-full">
            {badgeText}
          </div>
        )}
      </div>
      <div className="mt-1">
        <h2 className="font-bold text-xl mb-1">{title}</h2>
        {author && <p className="text-sm text-gray-700">작가 : {author}</p>}
        {publisher && <p className="text-sm text-gray-700">출판사 : {publisher}</p>}
      </div>
    </div>
  );
};

export default BookNoteHeaderCard;
