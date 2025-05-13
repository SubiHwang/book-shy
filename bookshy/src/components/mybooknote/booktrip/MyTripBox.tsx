import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import BookTripBubble from './BookTripBubble';
import type { BookTripWithUser } from '@/types/mybooknote/booktrip/booktrip';
import { deleteBookTrip, updateBookTrip } from '@/services/mybooknote/booktrip/booktrip';

interface Props {
  trip: BookTripWithUser;
}

const MyTripBox = ({ trip }: Props) => {
  const { bookId } = useParams<{ bookId: string }>();
  const queryClient = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(trip.content);

  // 편집 모드 시작 시 텍스트 영역에 포커스 및 높이 자동 조절
  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [editing]);

  // 내용 변경 시 텍스트 영역 높이 자동 조절
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

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

  const handleCancel = () => {
    setEditedContent(trip.content); // 원래 내용으로 복원
    setEditing(false);
  };

  return (
    <BookTripBubble
      profileImageUrl={trip.userProfile.profileImageUrl}
      nickname={trip.userProfile.nickname}
      createdAt={trip.createdAt}
      content={
        editing ? (
          <textarea
            ref={textareaRef}
            value={editedContent}
            onChange={handleTextareaChange}
            className="w-full bg-transparent border-0 outline-none resize-none text-sm leading-relaxed"
            placeholder="책을 읽고 느낀 점을 입력해주세요..."
          />
        ) : (
          trip.content
        )
      }
    >
      {editing ? (
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            disabled={isUpdating}
            className="flex items-center gap-1 text-xs text-gray-600 border px-2 py-1 rounded-md"
          >
            <X size={14} />
            <span>취소</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className={`flex items-center gap-1 text-xs text-white px-2 py-1 rounded-md ${
              isUpdating ? 'bg-primary/70' : 'bg-primary'
            }`}
          >
            {isUpdating ? (
              <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-md animate-spin"></span>
            ) : (
              <Check size={14} />
            )}
            <span>완료</span>
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(true)}
            disabled={isDeleting}
            className="flex items-center gap-1 text-xs text-gray-600 border px-2 py-1 rounded-md"
          >
            <Edit2 size={14} />
            <span>수정</span>
          </button>
          <button
            onClick={() => {
              if (window.confirm('정말 삭제하시겠습니까?')) {
                deleteTrip();
              }
            }}
            disabled={isDeleting}
            className={`flex items-center gap-1 text-xs text-white px-2 py-1 rounded-md ${
              isDeleting ? 'bg-red-400' : 'bg-red-500'
            }`}
          >
            {isDeleting ? (
              <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-md animate-spin"></span>
            ) : (
              <Trash2 size={14} />
            )}
            <span>삭제</span>
          </button>
        </div>
      )}
    </BookTripBubble>
  );
};

export default MyTripBox;
