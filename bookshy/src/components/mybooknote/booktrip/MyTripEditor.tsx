import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBookTrip } from '@/services/mybooknote/booktrip/booktrip';
import type { CreateBookTripRequest } from '@/types/mybooknote/booktrip/booktrip';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Props {
  profileImageUrl?: string;
}

const MyTripEditor = ({ profileImageUrl }: Props) => {
  const { bookId } = useParams<{ bookId: string }>();
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 컴포넌트 마운트 시 텍스트 영역에 포커스
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // 내용 변경 시 텍스트 영역 높이 자동 조절
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 300)}px`; // 최대 높이 제한
  };

  const { mutate: submitTrip, isPending } = useMutation({
    mutationFn: (trip: CreateBookTripRequest) => createBookTrip(trip),
    onSuccess: () => {
      toast.success('✅ 책의 여정이 등록되었습니다!');
      setContent(''); // 성공 후 입력 필드 초기화

      // 캐시 무효화
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

  // 글자 수 계산
  const charCount = content.length;
  const maxLength = 1000;

  return (
    <div className="relative bg-white rounded-2xl shadow-sm p-4 mt-8 mb-4">
      {/* 프로필 이미지 */}
      <div className="absolute -top-4 left-4">
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white">
          <img
            src={profileImageUrl || '/avatars/me.png'}
            className="w-full h-full object-cover"
            alt="내 프로필"
          />
        </div>
      </div>

      {/* 에디터 콘텐츠 */}
      <div className="mt-4">
        <div className="mb-1 text-xs font-medium text-gray-700">나의 한 마디</div>

        <textarea
          ref={textareaRef}
          placeholder="이 책을 읽고 느낀 점을 공유해주세요..."
          maxLength={maxLength}
          value={content}
          onChange={handleTextareaChange}
          className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm resize-none border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary min-h-[80px]"
        />

        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-gray-500">
            {charCount}/{maxLength}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex items-center gap-1 text-white bg-primary px-4 py-2 rounded-md text-sm disabled:opacity-50 transition-all hover:bg-primary-dark"
          >
            {isPending ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>
                작성 중...
              </>
            ) : (
              <>
                <Send size={16} />
                작성하기
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyTripEditor;
