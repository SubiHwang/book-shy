// src/components/mylibrary/BookShelf.tsx
import React from 'react';
import BookItem from './BookItem';
import { BookType } from '../../types/mylibrary';

interface BookShelfProps {
  books: BookType[];
  isLoading?: boolean;
}

const BookShelf: React.FC<BookShelfProps> = ({ books, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mb-3"></div>
          <p className="text-gray-500 text-sm">책을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <svg
          className="w-16 h-16 text-gray-300 mb-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
        <h3 className="text-lg font-medium text-gray-800 mb-2">아직 등록된 책이 없어요</h3>
        <p className="text-gray-500 text-sm mb-5 max-w-xs">
          첫 번째 책을 추가하고 독서 여정을 시작해보세요.
        </p>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          책 등록하기
        </button>
      </div>
    );
  }

  // 책을 3권씩 선반에 나누기
  const booksPerShelf = 3;
  const shelves = [];

  for (let i = 0; i < Math.ceil(books.length / booksPerShelf); i++) {
    const shelfBooks = books.slice(i * booksPerShelf, (i + 1) * booksPerShelf);
    shelves.push(shelfBooks);
  }

  return (
    <div className="space-y-4 pb-16">
      {shelves.map((shelf, index) => (
        <div key={`shelf-${index}`} className="relative">
          {/* 책 선반 */}
          <div className="flex justify-between px-2 pb-2">
            {shelf.map((book) => (
              <div key={book.id} className="w-1/3 px-1">
                <BookItem book={book} />
              </div>
            ))}
            {/* 선반에 빈 공간 채우기 */}
            {Array.from({ length: booksPerShelf - shelf.length }).map((_, i) => (
              <div key={`empty-${i}`} className="w-1/3 px-1"></div>
            ))}
          </div>

          {/* 선반 이미지 */}
          <div className="h-2 bg-gradient-to-b from-gray-300 to-gray-200 rounded-b-sm shadow-md relative">
            {/* 선반 앞쪽 테두리 효과 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-400 opacity-30"></div>
          </div>

          {/* 선반 아래 그림자 효과 - 더 작게 조정 */}
          <div className="h-2 w-full bg-gradient-to-b from-gray-200/30 to-transparent"></div>
        </div>
      ))}
    </div>
  );
};

export default BookShelf;
// // src/components/mylibrary/BookShelf.tsx
// import React from 'react';
// import BookItem from './BookItem';
// import { BookType } from '../../types/mylibrary';

// interface BookShelfProps {
//   books: BookType[];
//   isLoading: boolean;
// }

// const BookShelf: React.FC<BookShelfProps> = ({ books, isLoading }) => {
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center py-10">
//         <div className="flex flex-col items-center">
//           <div className="w-10 h-10 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mb-3"></div>
//           <p className="text-gray-500 text-sm">책을 불러오는 중...</p>
//         </div>
//       </div>
//     );
//   }

//   if (books.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
//         <svg
//           className="w-16 h-16 text-gray-300 mb-4"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
//           <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
//         </svg>
//         <h3 className="text-lg font-medium text-gray-800 mb-2">아직 등록된 책이 없어요</h3>
//         <p className="text-gray-500 text-sm mb-5 max-w-xs">
//           첫 번째 책을 추가하고 독서 여정을 시작해보세요.
//         </p>
//         <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
//           책 등록하기
//         </button>
//       </div>
//     );
//   }

//   // 책을 3권씩 선반에 나누기
//   const booksPerShelf = 3;
//   const shelves = [];

//   for (let i = 0; i < Math.ceil(books.length / booksPerShelf); i++) {
//     const shelfBooks = books.slice(i * booksPerShelf, (i + 1) * booksPerShelf);
//     shelves.push(shelfBooks);
//   }

//   return (
//     <div className="space-y-6 pb-16">
//       {shelves.map((shelf, index) => (
//         <div key={`shelf-${index}`} className="relative">
//           {/* 책 선반 */}
//           <div className="flex justify-between px-2 pb-2">
//             {shelf.map((book) => (
//               <div key={book.id} className="w-1/3 px-1">
//                 <BookItem book={book} />
//               </div>
//             ))}
//             {/* 선반에 빈 공간 채우기 */}
//             {Array.from({ length: booksPerShelf - shelf.length }).map((_, i) => (
//               <div key={`empty-${i}`} className="w-1/3 px-1"></div>
//             ))}
//           </div>

//           {/* 선반 이미지 */}
//           <div className="h-3 bg-gradient-to-b from-gray-300 to-gray-200 rounded-b-sm shadow-md relative">
//             {/* 선반 앞쪽 테두리 효과 */}
//             <div className="absolute top-0 left-0 right-0 h-1 bg-gray-400 opacity-30"></div>
//           </div>

//           {/* 선반 아래 그림자 효과 - 더 작게 조정 */}
//           <div className="h-2 w-full bg-gradient-to-b from-gray-200/30 to-transparent"></div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default BookShelf;

// // src/components/mylibrary/BookShelf.tsx
// import React from 'react';
// import BookItem from './BookItem';
// import { BookType } from '../../types/mylibrary';

// interface BookShelfProps {
//   books: BookType[];
//   isLoading: boolean;
// }

// const BookShelf: React.FC<BookShelfProps> = ({ books, isLoading }) => {
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center py-10">
//         <div className="flex flex-col items-center">
//           <div className="w-10 h-10 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mb-3"></div>
//           <p className="text-gray-500 text-sm">책을 불러오는 중...</p>
//         </div>
//       </div>
//     );
//   }

//   if (books.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
//         <svg
//           className="w-16 h-16 text-gray-300 mb-4"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
//           <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
//         </svg>
//         <h3 className="text-lg font-medium text-gray-800 mb-2">아직 등록된 책이 없어요</h3>
//         <p className="text-gray-500 text-sm mb-5 max-w-xs">
//           첫 번째 책을 추가하고 독서 여정을 시작해보세요.
//         </p>
//         <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
//           책 등록하기
//         </button>
//       </div>
//     );
//   }

//   // 책을 3권씩 선반에 나누기
//   const booksPerShelf = 3;
//   const shelves = [];

//   for (let i = 0; i < Math.ceil(books.length / booksPerShelf); i++) {
//     const shelfBooks = books.slice(i * booksPerShelf, (i + 1) * booksPerShelf);
//     shelves.push(shelfBooks);
//   }

//   return (
//     <div className="space-y-8 pb-16">
//       {shelves.map((shelf, index) => (
//         <div key={`shelf-${index}`} className="relative">
//           {/* 책 선반 */}
//           <div className="flex justify-between px-2 pb-2">
//             {shelf.map((book) => (
//               <div key={book.id} className="w-1/3 px-1">
//                 <BookItem book={book} />
//               </div>
//             ))}
//             {/* 선반에 빈 공간 채우기 */}
//             {Array.from({ length: booksPerShelf - shelf.length }).map((_, i) => (
//               <div key={`empty-${i}`} className="w-1/3 px-1"></div>
//             ))}
//           </div>

//           {/* 선반 이미지 */}
//           <div className="h-4 bg-gradient-to-b from-gray-300 to-gray-200 rounded-b-sm shadow-md relative">
//             {/* 선반 앞쪽 테두리 효과 */}
//             <div className="absolute top-0 left-0 right-0 h-1 bg-gray-400 opacity-30"></div>
//           </div>

//           {/* 선반 아래 그림자 효과 */}
//           <div className="h-4 w-full bg-gradient-to-b from-gray-200/30 to-transparent"></div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default BookShelf;
