// components/error/ErrorHandler.tsx
import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { ErrorEventDetail } from '@/types/common/error/Error';
import { ERROR_EVENT_TYPES } from '@/types/common/error/Error';

const ErrorHandler: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAppError = (event: CustomEvent<ErrorEventDetail>) => {
      const { type, statusCode, message, redirectUrl, ...rest } = event.detail;

      console.error('[Error Event]', event.detail);

      // redirectUrl이 지정된 경우 해당 URL로 이동
      if (redirectUrl) {
        navigate(redirectUrl, {
          state: {
            errorType: type,
            statusCode,
            message,
            ...rest,
          },
          replace: false, // 히스토리 유지
        });
        return;
      }

      // 비즈니스 로직 에러는 토스트로 처리 (사용자 친화적인 알림)
      if (type.startsWith('BUSINESS_')) {
        // 특수한 경우 처리
        if (type === ERROR_EVENT_TYPES.BUSINESS.PERMISSION) {
          // 권한 에러는 로그인 페이지로 리다이렉트
          navigate('/login', {
            state: {
              from: window.location.pathname,
              message: message || '로그인이 필요합니다.',
            },
          });
        } else if (type === ERROR_EVENT_TYPES.BUSINESS.RESOURCE_NOT_FOUND) {
          // 리소스 없음 에러는 404 페이지로 리다이렉트
          navigate('/error/not-found', {
            state: {
              message: message || '요청한 리소스를 찾을 수 없습니다.',
            },
          });
        } else {
          // 그 외 비즈니스 에러는 토스트로 표시
          toast.error(message || '오류가 발생했습니다.');
        }
        return;
      }

      // 시스템 에러 처리 (500번대 에러 등 심각한 에러)
      if (type.startsWith('SYSTEM_')) {
        navigate('/error/system', {
          state: {
            errorType: type,
            statusCode,
            message: message || '시스템 오류가 발생했습니다.',
            ...rest,
          },
        });
        return;
      }

      // 알 수 없는 에러 타입인 경우 기본 처리
      toast.error(message || '오류가 발생했습니다.');
    };

    // appError 이벤트 리스너 등록
    window.addEventListener('appError', handleAppError as EventListener);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('appError', handleAppError as EventListener);
    };
  }, [navigate]);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
};

export default ErrorHandler;
