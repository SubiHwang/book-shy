import { FC } from "react";
import { BookshelfRowProps } from "@/types/book";

const BookshelfRow: FC<BookshelfRowProps> = ({ books }) => {
  // 각 책장 열에 표시할 최대 책 수
  const maxBooksPerRow = 3;

  // 책이 부족한 경우 빈 공간으로 채우기
  const filledBooks = [...books];
  while (filledBooks.length < maxBooksPerRow) {
    filledBooks.push(null);
  }

  return (
    <div className="relative mb-6">
      {/* 책장 선반 */}
      <div className="flex justify-center items-end">
        <div className="flex justify-around w-full px-4 pb-2">
          {filledBooks.map((book, index) => (
            <div key={index} className="flex flex-col items-center" style={{ width: '28%' }}>
              {book ? (
                <div
                  className="w-full aspect-[3/4] bg-yellow-50 border border-yellow-200 shadow-md flex flex-col justify-center items-center rounded overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => console.log(`책 선택: ${book.title}`)}
                >
                  {book.bookImgUrl ? (
                    <img
                      src={book.bookImgUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-2">
                      <p className="text-sm font-medium">{book.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{book.author}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full aspect-[3/4] opacity-0"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 선반 디자인 */}
      <div className="w-full h-2 bg-gradient-to-b from-gray-300 to-gray-200 rounded-sm shadow-md"></div>
    </div>
  );
};

export default BookshelfRow;