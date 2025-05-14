import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorPageProps } from '@/types/common';

const ErrorState: FC<ErrorPageProps> = ({ type, message, onRetry }) => {
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
      description: message || '서버 또는 네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      logoData: '/logo/error/500Error.svg',
      primaryAction: {
        label: '다시 시도',
        onClick: onRetry || (() => window.location.reload()),
      },
    },
  };

  const { title, description, logoData, primaryAction } = errorConfig[type];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-8 mx-auto w-52 h-52">
          <img src={logoData} alt={`${type} 오류 이미지`} />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>

        <p className="text-gray-600 mb-8">{description}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={primaryAction.onClick}
            className="px-6 py-3 bg-primary-dark text-white rounded-lg hover:bg-primary-dark/90 transition-colors shadow-sm font-medium"
          >
            {primaryAction.label}
          </button>

          {type !== 'not-found' && (
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium"
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