import Header from '@/components/common/Header';
import { WishBook } from '@/types/book';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BookshelfRow from '@/components/common/BookshelfRow';
import { getNeighborhoodBookShelf } from '@/services/matching/matching';
import Loading from '@/components/common/Loading';

const NeighborBookshelfPage = () => {
  const navigate = useNavigate();
  const param = useParams();
  const [bookRows, setBookRows] = useState<WishBook[][]>([]);
  const [userBookList, setUserBookList] = useState<[] | WishBook[]>([]);
  const [userNickName, setUserNickName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userId: number = Number(param.userId);

  useEffect(() => {
    window.scroll({ top: 0, behavior: 'smooth' });
    const fetchNeighborBookShelf = async (userId: number) => {
      try {
        const response = await getNeighborhoodBookShelf(userId);
        setUserBookList(response.books);
        setUserNickName(response.nickname);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNeighborBookShelf(userId);
  }, [userId]);

  // 책 배열을 행으로 나누기
  useEffect(() => {
    const rows: WishBook[][] = [];
    const booksPerRow = 3;

    for (let i = 0; i < userBookList.length; i += booksPerRow) {
      rows.push(userBookList.slice(i, i + booksPerRow));
    }

    setBookRows(rows);
  }, [userBookList]);

  return (
    <div>
      <Header title="이웃의 서재" onBackClick={() => navigate(-1)} />
      <div className="bookshelf bg-white rounded-t-lg shadow-md mt-10 mx-3 min-h-screen pb-28">
        {isLoading ? (
          <Loading loadingText="서재 불러오는 중..." />
        ) : (
          <>
            <div className="flex sm:flex-row justify-center items-center p-4 text-center sm:text-left">
              <span className="text-light-text text-lg font-medium max-w-[200px] truncate">
                {userNickName}
              </span>
              <span className="text-light-text text-md ml-1">님의 서재</span>
            </div>
            <div className="flex justify-end items-center px-4 mb-8">
              <span className="text-light-text-muted text-sm font-light">공개 서재: </span>
              <span className="text-light-text-muted text-sm font-light">
                {userBookList.length}
              </span>
              <span className="text-light-text-muted text-sm font-light">권</span>
            </div>
            <div className="bookshelf-container mt-4 pb-4 px-3">
              {bookRows.map((row, index) => (
                <BookshelfRow key={index} books={row} userId={userId} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NeighborBookshelfPage;
