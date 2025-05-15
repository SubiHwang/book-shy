import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { searchBooksByKeyword, addBookFromSearch } from '@/services/mylibrary/bookSearchService';
import BookSelectCard from '@/components/mybooknote/booknote/BookSelectCard';

const BookNoteSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState('');
  const [submittedKeyword, setSubmittedKeyword] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['search-books', submittedKeyword],
    queryFn: () => searchBooksByKeyword(submittedKeyword),
    enabled: submittedKeyword.trim().length > 0,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittedKeyword(keyword);
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] pb-20">
      <div className="bg-[#f4b9c3] px-4 py-6 text-white">
        <button onClick={() => navigate(-1)} className="text-lg mb-2">
          {'<'} 뒤로가기
        </button>
        <h1 className="text-xl font-bold">읽었던 책을 검색 하세요.</h1>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="구병모"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full px-4 py-2 rounded-md text-black"
          />
          <button
            type="submit"
            className="bg-white text-[#f4b9c3] px-6 py-2 rounded-md font-bold whitespace-nowrap"
          >
            검색
          </button>
        </form>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {isLoading && <p className="text-center">불러오는 중...</p>}
        {!isLoading && data?.books?.length === 0 && (
          <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
        )}
        {data?.books?.map((book) => (
          <BookSelectCard
            key={book.itemId}
            book={book}
            onSelect={async () => {
              try {
                const added = await addBookFromSearch(book.itemId);
                await queryClient.invalidateQueries({ queryKey: ['user-library'] });
                alert(`📚 "${added.title}" 서재에 등록되었습니다.`);
                navigate(`/booknotes/create?libraryId=${added.libraryId}`);
              } catch (err) {
                alert('❌ 등록에 실패했습니다. 다시 시도해주세요.');
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BookNoteSelectPage;
