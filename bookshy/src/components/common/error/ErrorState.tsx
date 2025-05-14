import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorPageProps } from '@/types/common';

const ErrorState: FC<ErrorPageProps> = ({ type, message, onRetry, bgHeight="" }) => {
  const navigate = useNavigate();

  const errorConfig = {
    'not-found': {
      title: '페이지를 찾을 수 없습니다',
      description: message || '요청하신 페이지가 존재하지 않거나 이동되었습니다.',
      logoData: '/logo/error/404Error.svg',
      primaryAction: {
        label: '홈으로 돌아가기',
        onClick: () => navigate('/'),
      },
    },
    'unauthorized': {
      title: '로그인이 필요합니다',
      description: message || '이 페이지에 접근하려면 로그인이 필요합니다.',
      logoData: '/logo/error/401Error.svg',
      primaryAction: {
        label: '로그인하기',
        onClick: () => navigate('/login'),
      },
    },
    'server-error': {
      title: '일시적인 오류가 발생했습니다',
      description: message || `서버 또는 네트워크 오류가 발생했습니다. \n잠시 후 다시 시도해주세요.`,
      logoData: '/logo/error/500Error.svg',
      primaryAction: {
        label: '다시 시도',
        onClick: onRetry || (() => window.location.reload()),
      },
    },
  };

  const { title, description, logoData, primaryAction } = errorConfig[type];

  return (
    <div className={`flex flex-col items-center justify-center px-16 py-12 ${bgHeight}`}>
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mx-auto w-40 h-40">
          <img src={logoData} alt={`${type} 오류 이미지`} />
        </div>

        <h1 className="text-2xl font-bold text-[#5e4b39] mb-2">{title}</h1>

        <p className="text-sm text-[#8a7b70] mb-8 whitespace-pre-line">{description}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={primaryAction.onClick}
            className="px-6 py-3 bg-primary-accent text-white rounded-lg shadow-sm font-medium"
          >
            {primaryAction.label}
          </button>

          {type !== 'not-found' && (
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-[#F8F0E5] text-[#5e4b39] border border-primary-accent rounded-lg shadow-sm font-medium"
            >
              이전 페이지로
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;