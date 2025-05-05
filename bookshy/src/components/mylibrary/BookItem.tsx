// src/components/mylibrary/BookItem/index.tsx
import React from 'react';
import { BookType } from '../../types/mylibrary';

interface BookItemProps {
  book: BookType;
}

const BookItem: React.FC<BookItemProps> = ({ book }) => {
  return (
    <div className="flex flex-col items-center">
      {/* 책 커버 이미지만 표시 - 더 작은 이미지로 조정 */}
      <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
        <img
          src={book.coverUrl || '/images/book-placeholder.png'}
          alt={book.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {book.isPublic && (
          <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-1 py-0.5 rounded-bl-md">
            공개
          </div>
        )}
      </div>
    </div>
  );
};

export default BookItem;
// // src/components/mylibrary/BookItem/index.tsx
// import React from 'react';
// import { BookType } from '../../types/mylibrary';

// interface BookItemProps {
//   book: BookType;
// }

// const BookItem: React.FC<BookItemProps> = ({ book }) => {
//   return (
//     <div className="flex flex-col items-center">
//       {/* 책 커버 이미지만 표시 */}
//       <div className="relative w-full aspect-[2/3] rounded-sm overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
//         <img
//           src={book.coverUrl || '/images/book-placeholder.png'}
//           alt={book.title}
//           className="w-full h-full object-cover"
//           loading="lazy"
//         />
//         {book.isPublic && (
//           <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-1 py-0.5 rounded-bl-md">
//             공개
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BookItem;
