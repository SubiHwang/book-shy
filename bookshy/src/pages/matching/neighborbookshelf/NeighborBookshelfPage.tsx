import Header from '@/components/common/Header';
import { Book, NeighborBookshelf } from '@/types/book';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookshelfRow from '@/components/common/BookshelfRow';

const NeighborBookshelfPage = () => {
  const navigate = useNavigate();
  const [bookRows, setBookRows] = useState<Book[][]>([]);
  const dummyData: NeighborBookshelf = {
    userId: 1,
    userNickName: '마이콜',
    books: [
      {
        bookId: 1,
        title: '어린 왕자',
        author: '생택쥐페리',
        bookImgUrl: '어린왕자',
      },
    ],
  };

  // 책 배열을 행으로 나누기
  useEffect(() => {
    const rows: Book[][] = [];
    const booksPerRow = 3;

    for (let i = 0; i < dummyData.books.length; i += booksPerRow) {
      rows.push(dummyData.books.slice(i, i + booksPerRow));
    }

    setBookRows(rows);
  }, []);

  return (
    <div>
      <Header title="이웃의 서재" onBackClick={() => navigate(-1)} />
      <div className="bookshelf bg-white rounded-t-lg shadow-md mt-10 mx-3 h-screen">
        <div className="flex justify-center items-center p-4">
          <span className="text-light-text text-lg font-medium">{dummyData.userNickName}</span>
          <span className="text-light-text text-md">님 의 서재에 오신 것을 환영합니다!</span>
        </div>
        <div className="flex justify-end items-center px-4 mb-8">
          <span className="text-light-text-muted text-sm font-light">공개 서재: </span>
          <span className="text-light-text-muted text-sm font-light">{dummyData.books.length}</span>
          <span className="text-light-text-muted text-sm font-light">권</span>
        </div>
        <div className="bookshelf-container mt-4 pb-4 px-3">
          {bookRows.map((row, index) => (
            <BookshelfRow key={index} books={row} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NeighborBookshelfPage;
