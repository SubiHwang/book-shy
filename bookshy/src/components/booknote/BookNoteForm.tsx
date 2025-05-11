import React from 'react';

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
    <div>
      <section className="mb-6">
        <h2 className="text-red-500 text-sm font-semibold mb-1">✍️ 인용구</h2>
        <textarea
          value={quoteText}
          onChange={(e) => setQuoteText(e.target.value)}
          rows={3}
          maxLength={1000}
          className="w-full p-3 text-sm rounded-lg shadow bg-white"
        />
        <p className="text-xs text-right mt-1">{quoteText.length}/1000</p>
      </section>

      <section className="mb-6">
        <h2 className="text-red-500 text-sm font-semibold mb-1">💬 감상 기록</h2>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={6}
          maxLength={3000}
          className="w-full p-3 text-sm rounded-lg shadow bg-white"
        />
        <p className="text-xs text-right mt-1">{reviewText.length}/3000</p>
      </section>

      <button
        onClick={onSubmit}
        className="w-full py-3 text-white bg-pink-500 rounded-lg text-sm font-semibold shadow"
      >
        {submitLabel}
      </button>
    </div>
  );
};

export default BookNoteForm;
