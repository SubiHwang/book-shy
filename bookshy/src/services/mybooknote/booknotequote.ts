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
