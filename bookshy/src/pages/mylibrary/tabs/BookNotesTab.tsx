// src/components/mylibrary/BookDetail/BookNotesTab.tsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { fetchBookNote } from '@/services/mybooknote/booknote/booknote';
import { fetchBookQuote } from '@/services/mybooknote/booknote/bookquote';
import Loading from '@/components/common/Loading';
import BookNoteView from '@/components/mybooknote/booknote/BookNoteView';

// API 응답 구조에 맞게 인터페이스 수정
interface BookNoteResponse {
  content: string;
  // 필요한 다른 필드만 명시
}

interface BookQuoteResponse {
  content: string;
  // 필요한 다른 필드만 명시
}

interface OutletContextType {
  bookId: number | undefined;
}

const BookNotesTab: React.FC = () => {
  // Outlet 컨텍스트에서 bookDetail과 bookId 가져오기
  const { bookId } = useOutletContext<OutletContextType>();

  console.log('BookNotesTab - 받은 bookId:', bookId);

  const [note, setNote] = useState<BookNoteResponse | null>(null);
  const [quote, setQuote] = useState<BookQuoteResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 독후감과 인용구 가져오기
  useEffect(() => {
    const loadBookNoteAndQuote = async () => {
      if (!bookId) {
        setError('책 ID가 유효하지 않습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 병렬로 독후감과 인용구 데이터 가져오기
        const [noteResponse, quoteResponse] = await Promise.all([
          fetchBookNote(bookId).catch((err) => {
            console.error('독후감 가져오기 오류:', err);
            return null; // 오류 발생 시 null 반환
          }),
          fetchBookQuote(bookId).catch((err) => {
            console.error('인용구 가져오기 오류:', err);
            return null; // 오류 발생 시 null 반환
          }),
        ]);

        console.log('독후감 데이터:', noteResponse);
        console.log('인용구 데이터:', quoteResponse);

        // 타입 캐스팅 또는 응답 구조에 맞게 값 설정
        setNote(noteResponse as BookNoteResponse);
        setQuote(quoteResponse as BookQuoteResponse);
      } catch (err) {
        console.error('데이터를 가져오는 중 오류 발생:', err);
        setError('데이터를 불러오는 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadBookNoteAndQuote();
  }, [bookId]);

  if (loading) {
    return <Loading loadingText="독서 기록을 불러오는 중..." />;
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // 독후감 내용과 인용구 내용 추출
  const quoteText = quote?.content || '';
  const reviewText = note?.content || '';

  return (
    <div className="px-4 ">
      <BookNoteView quoteText={quoteText} reviewText={reviewText} />
    </div>
  );
};

export default BookNotesTab;
