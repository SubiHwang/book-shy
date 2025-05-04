import { Book } from '@/types/book';
import { FC } from 'react';
import { PlusCircle } from 'lucide-react';

const WishBooks: FC = () => {
  const dummyData: Book[] = [
    {
      bookId: 1,
      title: '어린 왕자',
      author: '생택쥐페리',
      publisher: '더스토리북',
      translator: '이명식',
    },
  ];
  return (
    <div>
      <div>검색</div>
      <div>
        <div>내가 읽고 싶은 책:</div>
        <option value="filter">
          <li>전체 보기</li>
        </option>
      </div>
      <div>
        {dummyData.length > 0 ? (
          <div>
            {dummyData.map((book) => (
              <div key={book.bookId}>
                <h3>{book.title}</h3>
                <p>저자: {book.author}</p>
                <p>출판사: {book.publisher}</p>
                {book.translator && <p>번역: {book.translator}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div>아직 읽고 싶은 책을 고르지 않았네요!</div>
        )}
      </div>
      <div className="fixed bottom-24 right-6">
        <button className="w-14 h-14 rounded-xl bg-primary text-white flex justify-center items-center shadow-lg">
          <PlusCircle size={32} strokeWidth={1} />
        </button>
      </div>
    </div>
  );
};

export default WishBooks;
