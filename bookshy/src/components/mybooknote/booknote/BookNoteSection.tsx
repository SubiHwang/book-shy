import React from 'react';

interface BookNoteSectionProps {
  label: string;
  icon?: string;
  content?: string;
  placeholder?: string;
}

const BookNoteSection: React.FC<BookNoteSectionProps> = ({ label, icon, content, placeholder }) => {
  return (
    <section className="mb-6">
      <h3 className="text-red-500 text-sm font-semibold mb-1">
        {icon && `${icon} `}
        {label}
      </h3>
      <p className="bg-white rounded-lg p-3 text-sm leading-relaxed shadow">
        {content || placeholder || '내용이 없습니다.'}
      </p>
    </section>
  );
};

export default BookNoteSection;
