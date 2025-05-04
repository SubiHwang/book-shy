import { WishBook } from '@/types/book';
import { FC, useMemo, useState } from 'react';
import { PlusCircle, Search, ChevronDown } from 'lucide-react';
import WishBookCard from '@/components/Matching/WishBooks/WishBookCard';

const WishBooks: FC = () => {
  const dummyData: WishBook[] = [
    {
      bookId: 1,
      title: '어린 왕자',
      author: '생택쥐페리',
      publisher: '더스토리북',
      translator: '이명식',
      categories: '고전 문학',
      bookImgUrl: 'imgurl',
      isLiked: true,
    },
    {
      bookId: 2,
      title: '파과',
      author: '구병모',
      publisher: '창비',
      translator: '',
      categories: '한국 문학',
      bookImgUrl: 'imgurl',
      isLiked: true,
    },
    {
      bookId: 3,
      title: '사피엔스',
      author: '유빌 하라리',
      publisher: '더스토리북',
      translator: '이명식',
      categories: '사회과학',
      isLiked: true,
    },
  ];

  const [selectedFilter, setSelectedFilter] = useState<string>('전체 보기');
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filterList = useMemo(() => {
    const categorySet = new Set<string>();
    dummyData.forEach((book) => {
      if (book.categories) {
        categorySet.add(book.categories);
      }
    });
    return ['전체 보기', ...Array.from(categorySet)];
  }, [dummyData]);

  const filteredBooks = useMemo(() => {
    const categoryFiltered =
      selectedFilter === '전체 보기'
        ? dummyData
        : dummyData.filter((book) => book.categories === selectedFilter);

    if (!searchTerm.trim()) return categoryFiltered;

    const term = searchTerm.toLowerCase().trim();
    return categoryFiltered.filter(
      (book) =>
        book.title?.toLowerCase().includes(term) || book.author?.toLowerCase().includes(term),
    );
  }, [dummyData, selectedFilter, searchTerm]);

  return (
    <div className="relative pb-16 px-4 pt-4">
      <div className="mb-5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="읽고 싶은 책 검색 (책 제목, 저자)"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="font-light text-light-text-secondary">총 {filteredBooks.length} 권</div>
          <div className="relative">
            <button
              className="flex items-center border rounded px-3 py-1 text-sm"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <span>{selectedFilter}</span>
              <ChevronDown size={16} className="ml-1" />
            </button>

            {filterOpen && (
              <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg z-10 w-32">
                <ul className="py-1">
                  {filterList.map((category) => (
                    <li
                      key={category}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm font-light"
                      onClick={() => {
                        setSelectedFilter(category);
                        setFilterOpen(false);
                      }}
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        {filteredBooks.length > 0 ? (
          <div>
            {filteredBooks.map((book) => (
              <WishBookCard wishBook={book} />
            ))}
          </div>
        ) : (
          <div>아직 읽고 싶은 책을 고르지 않았네요! 읽고 싶은 책들을 찾아볼까요?</div>
        )}
      </div>
      <div className="fixed bottom-24 right-6">
        <button className="w-14 h-14 rounded-xl bg-primary text-white flex justify-center items-center shadow-lg">
          <PlusCircle size={32} strokeWidth={1} />
        </button>
      </div>
    </div>
  );
};

export default WishBooks;
