import { useState, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { BookType } from '@/types/mylibrary/models';

const SelfBookEntryPage: FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [publisher, setPublisher] = useState<string>('');
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 이미지 업로드 처리
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 실제 구현에서는 이미지 업로드 API를 호출하여 서버에 저장
      // 임시로 URL.createObjectURL을 사용하여 미리보기 제공
      const imageUrl = URL.createObjectURL(file);
      setCoverUrl(imageUrl);
    }
  };

  // 책 등록 처리
  const handleRegister = async () => {
    if (!title.trim()) {
      // 제목은 필수 입력
      alert('책 제목을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 새 책 객체 생성
      const newBook: BookType = {
        id: `manual-${Date.now()}`, // 임시 ID 생성
        title,
        author: author || '저자 미상',
        coverUrl: coverUrl || '/api/placeholder/100/150', // 기본 이미지
        isPublic: true,
        addedAt: new Date(),
      };

      // 실제 앱에서는 API 호출하여 DB에 저장
      // await addBookToLibrary(newBook);
      console.log('등록할 책 정보:', newBook);

      // 성공 후 내 서재 페이지로 이동
      navigate('/bookshelf');
    } catch (error) {
      console.error('책 등록 중 오류 발생:', error);
      setIsSubmitting(false);
    }
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
          {/* 표지 업로드 */}
          <div className="mb-8 flex flex-col items-center">
            <div className="flex items-center self-start mb-3">
              <Pencil size={16} className="text-primary-light mr-2" />
              <label className="text-light-text-secondary text-sm">표지 입력</label>
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
                  {coverUrl ? (
                    <img
                      src={coverUrl}
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
                책 이름
              </label>
            </div>
            <input
              type="text"
              id="book-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="마이클"
              className="w-full p-3 border border-light-text-muted/30 rounded-md focus:outline-none focus:border-primary-light"
            />
          </div>

          {/* 저자 입력 */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Pencil size={16} className="text-primary-light mr-2" />
              <label htmlFor="book-author" className="text-light-text-secondary text-sm">
                저자
              </label>
            </div>
            <input
              type="text"
              id="book-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="마이클"
              className="w-full p-3 border border-light-text-muted/30 rounded-md focus:outline-none focus:border-primary-light"
            />
          </div>

          {/* 출판사 입력 */}
          <div className="mb-10">
            <div className="flex items-center mb-2">
              <Pencil size={16} className="text-primary-light mr-2" />
              <label htmlFor="book-publisher" className="text-light-text-secondary text-sm">
                출판사
              </label>
            </div>
            <input
              type="text"
              id="book-publisher"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              placeholder=""
              className="w-full p-3 border border-light-text-muted/30 rounded-md focus:outline-none focus:border-primary-light"
            />
          </div>

          {/* 등록 버튼 */}
          <div className="mt-6 mb-8">
            <button
              onClick={handleRegister}
              disabled={isSubmitting}
              className="w-full py-3 bg-primary-light text-white rounded-md hover:bg-primary-accent transition-colors"
            >
              {isSubmitting ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfBookEntryPage;
