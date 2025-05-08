import { FC } from 'react';
import WishBookCard from '../wishbooks/WishBookCard';
import { SearchResultListProps } from '@/types/Matching';

const SearchResultBookList: FC<SearchResultListProps> = ({ resultList, searchTerm, total }) => {
  return (
    <div>
      <div className="flex flex-col text-light-text px-8 py-4">
        <div className="flex gap-2 justify-between items-center mb-1">
          <p className="text-lg font-medium">
            <span className="font-semibold text-primary-dark">{searchTerm} </span>의 검색 결과
          </p>
          <p className='font-light'>검색 결과 수 : {total}</p>
        </div>
      </div>
      <div className="flex flex-col px-4">
        {resultList.map((book) => (
          <WishBookCard wishBook={book} />
        ))}
      </div>
    </div>
  );
};
export default SearchResultBookList;
