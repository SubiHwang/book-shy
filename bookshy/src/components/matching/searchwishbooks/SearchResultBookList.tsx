import WishBookCard from '../wishbooks/WishBookCard';

const SearchResultBookList = () => {
  const dummyData = [{ bookId: 1, title: '책 제목 1', author: '저자 1', summary: '책 요약 1 ' }];
  return (
    <div>
      <div className="flex flex-col text-light-text px-8 py-4">
        <div className="flex gap-2 justify-start items-center mb-1">
          <p className="text-lg font-medium">검색 결과</p>
        </div>
      </div>
      <div className="flex flex-col px-4">
        {dummyData.map((book) => (
          <WishBookCard wishBook={book} />
        ))}
      </div>
    </div>
  );
};
export default SearchResultBookList;
