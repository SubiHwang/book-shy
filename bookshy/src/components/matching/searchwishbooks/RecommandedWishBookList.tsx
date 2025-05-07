import { FileQuestion } from 'lucide-react';
import WishBookCard from '../wishbooks/WishBookCard';

const RecommandedWishBookList = () => {
  const dummyData = [
    { bookId: 1, title: '책 제목 1', author: '저자 1', summary: '책 요약 1 ', isLiked: false },
    { bookId: 2, title: '책 제목 2', author: '저자 2', summary: '책 요약 2', isLiked: false },
    { bookId: 3, title: '책 제목 3', author: '저자 3', summary: '책 요약 3', isLiked: false },
    { bookId: 4, title: '책 제목 4', author: '저자 4', summary: '책 요약 4', isLiked: false },
    { bookId: 5, title: '책 제목 5', author: '저자 5', summary: '책 요약 5', isLiked: false },
    { bookId: 6, title: '책 제목 6', author: '저자 6', summary: '책 요약 6', isLiked: false },
    // ... 더미 데이터 추가
  ];

  return (
    <div>
      <div className="flex flex-col text-light-text px-8 py-4">
        <div className="flex gap-2 justify-start items-center mb-1">
          <FileQuestion size={24} />
          <p className="text-lg font-medium">이런 책은 어때요?</p>
        </div>
        <p className="text-md font-light">
          회원님의 소장 도서와 취향이 비슷한 회원들이 많이 담은 인기 도서를 분석하여 취향에 맞는
          최적의 책을 추천해드려요.
        </p>
      </div>
      <div className="flex flex-col px-4">
        {dummyData.map((book) => (
          <WishBookCard wishBook={book} />
        ))}
      </div>
    </div>
  );
};

export default RecommandedWishBookList;
