import { useQuery } from '@tanstack/react-query';
import { fetchBookNotes } from '@/services/mybooknote/booknote';
import BookNotePetalPage from './MyBookNotePetalPage';
import LibraryBookListPage from './LibraryBookListPage';

const MyBookNotePage = () => {
  const userId = 1;

  const { data = [], isLoading } = useQuery({
    queryKey: ['my-booknotes', userId],
    queryFn: () => fetchBookNotes(userId),
  });

  if (isLoading) return <p className="p-4">불러오는 중...</p>;

  return data.length > 0 ? <BookNotePetalPage bookNotes={data} /> : <LibraryBookListPage />;
};

export default MyBookNotePage;
