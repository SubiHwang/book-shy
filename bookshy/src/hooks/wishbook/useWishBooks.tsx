import { useQuery } from '@tanstack/react-query';
import { getWishBookList } from '@/services/matching/wishbooks';
import { WishBooksResponse } from '@/types/Matching';

export const useWishBooks = () => {
  return useQuery<WishBooksResponse, Error>({
    queryKey: ['wishBooks'],
    queryFn: () => getWishBookList(),
  });
};
