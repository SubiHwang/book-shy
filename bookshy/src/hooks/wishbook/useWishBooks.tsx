import { useQuery } from '@tanstack/react-query';
import { getWishBookList } from '@/services/matching/wishbooks';
import { WishBooksResponse } from '@/types/Matching';

export const useWishBooks = (userId: number) => {
  return useQuery<WishBooksResponse, Error>({
    queryKey: ['wishBooks', userId],
    queryFn: () => getWishBookList(userId),
  });
};
