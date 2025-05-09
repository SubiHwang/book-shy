// src/pages/mylibrary/AddBook/AddBySelfPage.tsx
import { useState, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { addBookBySelf } from '@/services/mylibrary/bookAddService';
import { useAuth } from '@/contexts/AuthContext';

const AddBySelfPage: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [publisher, setPublisher] = useState<string>('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 이미지 업로드 처리
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일 객체 저장
      setCoverImage(file);

      // 미리보기 URL 생성
      const imageUrl = URL.createObjectURL(file);
      setCoverPreviewUrl(imageUrl);
    }
  };

  // 책 등록 처리
  const handleRegister = async () => {
    // 입력 유효성 검사
    if (!title.trim()) {
      setError('책 제목을 입력해주세요.');
      return;
    }

    if (!author.trim()) {
      setError('저자를 입력해주세요.');
      return;
    }

    if (!publisher.trim()) {
      setError('출판사를 입력해주세요.');
      return;
    }

    if (!coverImage) {
      setError('표지 이미지를 업로드해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 개발 중이므로 기본 사용자 ID 사용 (로그인 없이 테스트 가능)
      const userId = Number(user?.id) || 1;

      // API 호출하여 도서 등록
      const registeredBook = await addBookBySelf(
        userId,
        title,
        author,
        publisher,
        coverImage,
        isPublic,
      );

      console.log('등록된 책 정보:', registeredBook);

      // 성공 알림 표시
      alert('책이 성공적으로 등록되었습니다!');

      // 내 서재 페이지로 이동
      navigate('/bookshelf');
    } catch (error: any) {
      console.error('책 등록 중 오류 발생:', error);
      setError(error.message || '책 등록에 실패했습니다. 다시 시도해주세요.');
      setIsSubmitting(false);
    }
  };

  // 공개 여부 토글 처리
  const handleTogglePublic = () => {
    setIsPublic(!isPublic);
  };

  return (
    <div className="flex flex-col h-screen bg-light-bg">
      {/* 헤더 */}
      <div className="bg-primary-light p-4 text-white">
        <div className="relative flex items-center justify-center">
          <button onClick={() => navigate(-1)} className="absolute left-0">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-medium">책 정보를 입력하세요</h1>
        </div>
      </div>

      {/* 전체 내용을 감싸는 스크롤 영역 */}
      <div className="flex-1 overflow-auto pb-16">
        <div className="max-w-md mx-auto p-4">
          {/* 오류 메시지 */}
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

          {/* 표지 업로드 */}
          <div className="mb-8 flex flex-col items-center">
            <div className="flex items-center self-start mb-3">
              <Pencil size={16} className="text-primary-light mr-2" />
              <label className="text-light-text-secondary text-sm">표지 입력 (필수)</label>
            </div>
            <div className="w-40 h-56">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="cover-upload"
              />
              <label htmlFor="cover-upload" className="cursor-pointer block w-full h-full">
                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
                  {coverPreviewUrl ? (
                    <img
                      src={coverPreviewUrl}
                      alt="책 표지"
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400 text-4xl">+</span>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* 책 제목 입력 */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Pencil size={16} className="text-primary-light mr-2" />
              <label htmlFor="book-title" className="text-light-text-secondary text-sm">
                책 이름 (필수)
              </label>
            </div>
            <input
              type="text"
              id="book-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="책 이름"
              className="w-full p-3 border border-light-text-muted/30 rounded-md focus:outline-none focus:border-primary-light"
            />
          </div>

          {/* 저자 입력 */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Pencil size={16} className="text-primary-light mr-2" />
              <label htmlFor="book-author" className="text-light-text-secondary text-sm">
                저자 (필수)
              </label>
            </div>
            <input
              type="text"
              id="book-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="저자"
              className="w-full p-3 border border-light-text-muted/30 rounded-md focus:outline-none focus:border-primary-light"
            />
          </div>

          {/* 출판사 입력 */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Pencil size={16} className="text-primary-light mr-2" />
              <label htmlFor="book-publisher" className="text-light-text-secondary text-sm">
                출판사 (필수)
              </label>
            </div>
            <input
              type="text"
              id="book-publisher"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              placeholder="출판사"
              className="w-full p-3 border border-light-text-muted/30 rounded-md focus:outline-none focus:border-primary-light"
            />
          </div>

          {/* 공개 설정 토글 추가 */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={handleTogglePublic}
              className="w-4 h-4 text-primary-light focus:ring-primary-light rounded"
            />
            <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
              다른 사용자에게 이 책을 공개하기
            </label>
          </div>

          {/* 등록 버튼 */}
          <div className="mt-6 mb-8">
            <button
              onClick={handleRegister}
              disabled={isSubmitting}
              className="w-full py-3 bg-primary-light text-white rounded-md hover:bg-primary-accent transition-colors disabled:bg-gray-400"
            >
              {isSubmitting ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBySelfPage;
