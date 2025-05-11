import React from 'react';

interface BookNoteLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

const BookNoteLayout: React.FC<BookNoteLayoutProps> = ({ header, children }) => {
  return (
    <div className="min-h-screen">
      {/* 헤더 영역 */}
      <div className="bg-[#f5edda] px-4 py-4">{header}</div>

      {/* 내용 영역 */}
      <div className="bg-[#f9f4ec] px-4 pb-28">{children}</div>
    </div>
  );
};

export default BookNoteLayout;
