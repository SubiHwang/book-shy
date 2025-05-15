import {
  ERROR_EVENT_TYPES,
  ErrorEventType,
  SystemErrorSubType,
  BusinessErrorSubType,
  ErrorDetail,
  ErrorEventDetail,
  ErrorPageProps,
  DEFAULT_ERROR_TYPE_MAPPING,
  ErrorTypeMapping,
  ErrorType,
} from '@/types/common/error/Error';

// 에러 이벤트 생성 및 발송 함수
export const dispatchErrorEvent = (
  errorType: ErrorEventType,
  errorDetail: ErrorDetail = {},
): void => {
  const event = new CustomEvent<ErrorEventDetail>('appError', {
    detail: {
      type: errorType,
      timestamp: new Date().toISOString(),
      ...errorDetail,
    },
  });

  window.dispatchEvent(event);
};

// 시스템 에러 헬퍼 함수
export const dispatchSystemError = (
  subType: SystemErrorSubType,
  errorDetail: ErrorDetail = {},
): void => {
  const errorType = ERROR_EVENT_TYPES.SYSTEM[subType];
  dispatchErrorEvent(errorType, errorDetail);
};

// 비즈니스 에러 헬퍼 함수
export const dispatchBusinessError = (
  subType: BusinessErrorSubType,
  errorDetail: ErrorDetail = {},
): void => {
  const errorType = ERROR_EVENT_TYPES.BUSINESS[subType];
  dispatchErrorEvent(errorType, errorDetail);
};

// HTTP 상태 코드 기반 에러 발송 함수
export const dispatchHttpError = (statusCode: number, errorDetail: ErrorDetail = {}): void => {
  // 시스템 에러 (5xx)
  if (statusCode >= 500) {
    dispatchSystemError('SERVER', {
      statusCode,
      ...errorDetail,
    });
  }
  // 비즈니스 에러 (4xx)
  else if (statusCode >= 400) {
    // 에러 타입 매핑
    let subType: BusinessErrorSubType = 'VALIDATION';
    if (statusCode === 401 || statusCode === 403) {
      subType = 'PERMISSION';
    } else if (statusCode === 404) {
      subType = 'RESOURCE_NOT_FOUND';
    } else if (statusCode === 409) {
      subType = 'DUPLICATE';
    }

    dispatchBusinessError(subType, {
      statusCode,
      ...errorDetail,
    });
  }
};

// 에러 이벤트 타입을 ErrorPageProps로 변환하는 유틸리티 함수
export const convertErrorEventToProps = (
  eventDetail: ErrorEventDetail,
  mapping: ErrorTypeMapping = DEFAULT_ERROR_TYPE_MAPPING,
): ErrorPageProps => {
  // 매핑에서 해당 에러 타입에 맞는 ErrorType 가져오기
  const errorType: ErrorType = mapping[eventDetail.type] || 'server-error';

  return {
    type: errorType,
    message: eventDetail.message,
    bgHeight: 'min-h-screen', // 기본값, 필요에 따라 조정 가능
    onRetry: () => window.history.back(), // 기본 재시도 동작, 필요에 따라 조정 가능
  };
};
