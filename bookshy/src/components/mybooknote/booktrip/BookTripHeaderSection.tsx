import { useImageColors } from '@/hooks/common/useImageColors';
import { createGradientStyle } from '@/utils/common/gradientStyles';

interface Props {
  title: string;
  author: string;
  publisher: string;
  coverUrl?: string;
}

const BookTripHeaderSection = ({ title, author, publisher, coverUrl }: Props) => {
  // 이미지에서 색상 추출 및 파스텔 색상 자동 생성
  const { pastelColors } = useImageColors(
    coverUrl || null,
    ['#FCF6D4', '#F4E8B8'], // 기본 색상
    0.65, // 더 밝은 파스텔 색상을 위한 밝기 조정값 (0-1)
    220, // 최소 밝기값 (0-255)
  );

  // 배경 그라데이션 스타일 생성
  const gradientStyle = createGradientStyle(pastelColors, 'bottom right');

  return (
    <div
      className="flex flex-col justify-end p-4 shadow-sm rounded-lg min-h-[20vh] mb-4"
      style={gradientStyle}
    >
      {/* 내용물을 하단에 배치 */}
      <div className="flex flex-row items-start mt-auto">
        {/* 책 표지 이미지 */}
        <div className="w-24 h-32 flex-shrink-0 mr-4 rounded-md overflow-hidden shadow-md bg-white relative">
          <img
            src={coverUrl || '/placeholder.jpg'}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 책 정보 - 제목이 긴 경우를 위해 개선 */}
        <div className="flex-1 min-w-0 flex flex-col min-h-32 justify-between text-gray-800">
          <div className="overflow-hidden">
            {/* 긴 제목도 잘 보이게 조정 */}
            <h2 className="text-lg font-bold mb-2 break-words line-clamp-3 leading-tight">
              {title || '제목 정보 없음'}
            </h2>
            <p className="text-sm mb-1 truncate">작가: {author || '정보 없음'}</p>
            <p className="text-sm mb-1 truncate">출판사: {publisher || '정보 없음'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTripHeaderSection;
