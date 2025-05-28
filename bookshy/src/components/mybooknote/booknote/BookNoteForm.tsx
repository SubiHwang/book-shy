import React from 'react';
import { Quote, MessageSquare } from 'lucide-react';

interface BookNoteFormProps {
  quoteText: string;
  reviewText: string;
  setQuoteText: (value: string) => void;
  setReviewText: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void; // 취소 버튼 핸들러 추가
  submitLabel?: string;
  cancelLabel?: string; // 취소 버튼 텍스트 커스터마이징 옵션
}

const BookNoteForm: React.FC<BookNoteFormProps> = ({
  quoteText,
  reviewText,
  setQuoteText,
  setReviewText,
  onSubmit,
  onCancel,
  submitLabel = '등록하기',
  cancelLabel = '취소하기',
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

      <div className="flex gap-3">
        {/* onCancel prop이 제공된 경우에만 취소 버튼 렌더링 */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            {cancelLabel}
          </button>
        )}
        <button
          onClick={onSubmit}
          className={`py-3 text-white bg-primary-light rounded-lg text-sm font-medium shadow-sm hover:bg-primary transition-colors ${
            onCancel ? 'flex-1' : 'w-full'
          }`}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
};

export default BookNoteForm;
