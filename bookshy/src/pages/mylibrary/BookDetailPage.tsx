// src/pages/mylibrary/BookDetailPage.tsx
import { useParams } from 'react-router-dom';
import BookDetail from '@/components/mylibrary/BookDetail/BookDetail';

const BookDetailPage = () => {
  // URL 파라미터에서 책 ID 가져오기
  const { id } = useParams<{ id: string }>();

  // 책 ID가 없으면 오류 표시
  if (!id) {
    return <div className="p-6">책 ID가 올바르지 않습니다.</div>;
  }

  // BookDetail 컴포넌트에 책 ID 전달
  return <BookDetail bookId={parseInt(id)} />;
};

export default BookDetailPage;
