import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBookTrip } from '@/services/mybooknote/booktrip/booktrip';
import type { CreateBookTripRequest } from '@/types/mybooknote/booktrip/booktrip';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

interface Props {
  profileImageUrl?: string;
}

const MyTripEditor = ({ profileImageUrl }: Props) => {
  const { bookId } = useParams<{ bookId: string }>();
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');

  const { mutate: submitTrip, isPending } = useMutation({
    mutationFn: (trip: CreateBookTripRequest) => createBookTrip(trip),
    onSuccess: () => {
      toast.success('✅ 책의 여정이 등록되었습니다!');

      // ✅ 1. 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['libraryBooksWithTrip'] });
      queryClient.invalidateQueries({ queryKey: ['bookTrips', bookId] });
    },
    onError: () => {
      toast.error('❌ 책의 여정 등록에 실패했습니다.');
    },
  });

  const handleSubmit = () => {
    if (!bookId) {
      toast.error('❌ 유효한 도서 ID가 없습니다.');
      return;
    }

    if (!content.trim()) {
      toast.warning('내용을 입력해주세요.');
      return;
    }

    submitTrip({ bookId: Number(bookId), content });
  };

  return (
    <div className="flex gap-2 items-start mt-4">
      <img
        src={profileImageUrl || '/avatars/me.png'}
        className="w-8 h-8 rounded-full"
        alt="내 프로필"
      />
      <div className="flex-1">
        <textarea
          placeholder="0/1000"
          maxLength={1000}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-white rounded-md shadow-sm px-3 py-2 text-sm resize-none"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="text-white bg-primary px-4 py-2 rounded-md text-sm disabled:opacity-50"
          >
            {isPending ? '작성 중...' : '작성하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyTripEditor;
