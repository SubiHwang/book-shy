import { authAxiosInstance } from '@/services/axiosInstance';

export interface CreateNoteWithQuoteRequest {
  bookId: number;
  reviewContent: string;
  quoteContent: string;
}

export const createNoteWithQuote = async (payload: CreateNoteWithQuoteRequest) => {
  const response = await authAxiosInstance.post('/notes-with-quote', payload);
  return response;
};

export interface UpdateNoteWithQuoteRequest {
  reviewId: number;
  quoteId: number;
  reviewContent: string;
  quoteContent: string;
}

export const updateNoteWithQuote = async ({
  reviewId,
  quoteId,
  reviewContent,
  quoteContent,
}: UpdateNoteWithQuoteRequest) => {
  const response = await authAxiosInstance.put(
    `/notes-with-quote?reviewId=${reviewId}&quoteId=${quoteId}`,
    { reviewContent, quoteContent },
  );
  return response.data;
};
