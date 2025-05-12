import React from 'react';
import { Quote, MessageSquare } from 'lucide-react';

interface BookNoteFormProps {
  quoteText: string;
  reviewText: string;
  setQuoteText: (value: string) => void;
  setReviewText: (value: string) => void;
  onSubmit: () => void;
  submitLabel?: string;
}

const BookNoteForm: React.FC<BookNoteFormProps> = ({
  quoteText,
  reviewText,
  setQuoteText,
  setReviewText,
  onSubmit,
  submitLabel = '등록하기',
}) => {
  return (
    <div className="p-4">
      <section className="mb-5">
        <div className="flex items-center mb-2">
          <Quote size={18} className="text-primary-light mr-1" />
          <h2 className="text-sm font-medium">인용구</h2>
        </div>
        <div className="relative">
          <textarea
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
            placeholder="인상 깊었던 구절을 기록해보세요"
            rows={5}
            maxLength={1000}
            className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-light"
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {quoteText.length}/1000
          </div>
        </div>
      </section>

      <section className="mb-6">
        <div className="flex items-center mb-2">
          <MessageSquare size={18} className="text-primary-light mr-1" />
          <h2 className="text-sm font-medium">감상 기록</h2>
        </div>
        <div className="relative">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="이 책에 대한 감상을 자유롭게 기록해보세요"
            rows={8}
            maxLength={1000}
            className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-light"
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {reviewText.length}/1000
          </div>
        </div>
      </section>

      <button
        onClick={onSubmit}
        className="w-full py-3 text-white bg-primary-light rounded-lg text-sm font-medium shadow-sm"
      >
        {submitLabel}
      </button>
    </div>
  );
};

export default BookNoteForm;