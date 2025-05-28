import React from 'react';
import { Quote, MessageSquare } from 'lucide-react';

interface BookNoteViewProps {
  quoteText?: string;
  reviewText?: string;
}

const BookNoteView: React.FC<BookNoteViewProps> = ({ quoteText, reviewText }) => {
  return (
    <div className="p-4">
      <section className="mb-5">
        <div className="flex items-center mb-2">
          <Quote size={18} className="text-primary-light mr-1" />
          <h2 className="text-sm font-medium">인용구</h2>
        </div>
        <div className="relative">
          <div className="w-full p-3 text-sm border border-gray-200 rounded-lg bg-gray-50 min-h-[120px] whitespace-pre-wrap">
            {quoteText ? (
              <p className="text-gray-800">{quoteText}</p>
            ) : (
              <p className="text-gray-400 italic">등록된 인용구가 없습니다.</p>
            )}
          </div>
        </div>
      </section>

      <section className="mb-6">
        <div className="flex items-center mb-2">
          <MessageSquare size={18} className="text-primary-light mr-1" />
          <h2 className="text-sm font-medium">감상 기록</h2>
        </div>
        <div className="relative">
          <div className="w-full p-3 text-sm border border-gray-200 rounded-lg bg-gray-50 min-h-[192px] whitespace-pre-wrap">
            {reviewText ? (
              <p className="text-gray-800">{reviewText}</p>
            ) : (
              <p className="text-gray-400 italic">작성된 독후감이 없습니다.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookNoteView;
