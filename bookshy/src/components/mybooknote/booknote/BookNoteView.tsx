import React from 'react';

interface BookNoteViewProps {
  quoteText?: string;
  reviewText?: string;
}

const BookNoteView: React.FC<BookNoteViewProps> = ({ quoteText, reviewText }) => {
  return (
    <div>
      <section className="mb-6">
        <h2 className="text-red-500 text-sm font-semibold mb-1">✍️ 인용구</h2>
        <textarea
          value={quoteText || '등록된 인용구가 없습니다.'}
          readOnly
          rows={3}
          className="w-full p-3 text-sm rounded-lg shadow bg-white resize-none"
        />
      </section>

      <section className="mb-6">
        <h2 className="text-red-500 text-sm font-semibold mb-1">💬 감상 기록</h2>
        <textarea
          value={reviewText || '작성된 독후감이 없습니다.'}
          readOnly
          rows={6}
          className="w-full p-3 text-sm rounded-lg shadow bg-white resize-none"
        />
      </section>
    </div>
  );
};

export default BookNoteView;
