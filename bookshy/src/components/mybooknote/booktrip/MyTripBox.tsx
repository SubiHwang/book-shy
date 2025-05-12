import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

import BookTripBubble from './BookTripBubble';
import type { BookTripWithUser } from '@/types/mybooknote/booktrip/booktrip';
import { deleteBookTrip, updateBookTrip } from '@/services/mybooknote/booktrip/booktrip';

interface Props {
  trip: BookTripWithUser;
}

const MyTripBox = ({ trip }: Props) => {
  const { bookId } = useParams<{ bookId: string }>();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(trip.content);

  const { mutate: deleteTrip, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteBookTrip(trip.tripId),
    onSuccess: () => {
      toast.success('🗑️ 책의 여정이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['bookTrips', bookId] });
      queryClient.invalidateQueries({ queryKey: ['libraryBooksWithTrip'] });
    },
    onError: () => {
      toast.error('❌ 삭제에 실패했습니다.');
    },
  });

  const { mutate: updateTrip, isPending: isUpdating } = useMutation({
    mutationFn: () => updateBookTrip(trip.tripId, { content: editedContent }),
    onSuccess: () => {
      toast.success('✏️ 수정이 완료되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['bookTrips', bookId] });
      setEditing(false);
    },
    onError: () => {
      toast.error('❌ 수정에 실패했습니다.');
    },
  });

  const handleSave = () => {
    if (!editedContent.trim()) {
      toast.warning('수정할 내용을 입력해주세요.');
      return;
    }
    updateTrip();
  };

  return (
    <BookTripBubble
      profileImageUrl={trip.userProfile.profileImageUrl}
      nickname={trip.userProfile.nickname}
      createdAt={trip.createdAt}
      content={
        editing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full bg-white rounded-md shadow px-3 py-2 text-sm resize-none min-h-[72px]"
          />
        ) : (
          trip.content
        )
      }
      isMine
    >
      {editing ? (
        <>
          <button
            onClick={() => setEditing(false)}
            className="text-xs text-gray-600 border px-3 py-1 rounded-md"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="text-xs text-white bg-primary px-3 py-1 rounded-md disabled:opacity-50"
          >
            {isUpdating ? '저장 중...' : '저장하기'}
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => deleteTrip()}
            disabled={isDeleting}
            className="text-xs text-gray-600 border px-3 py-1 rounded-md disabled:opacity-50"
          >
            {isDeleting ? '삭제 중...' : '삭제하기'}
          </button>
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-white bg-primary px-3 py-1 rounded-md"
          >
            수정하기
          </button>
        </>
      )}
    </BookTripBubble>
  );
};

export default MyTripBox;
