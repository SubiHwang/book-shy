export type ErrorType = 'not-found' | 'unauthorized' | 'server-error';
export interface ErrorPageProps {
  type: ErrorType;
  message?: string;
  onRetry?: () => void;
  bgHeight: string;
}

export const ERROR_EVENT_TYPES = {
  SYSTEM: {
    NETWORK: 'SYSTEM_NETWORK_ERROR',
    SERVER: 'SYSTEM_SERVER_ERROR',
    TIMEOUT: 'SYSTEM_TIMEOUT_ERROR',
    UNKNOWN: 'SYSTEM_UNKNOWN_ERROR',
  },
  BUSINESS: {
    VALIDATION: 'BUSINESS_VALIDATION_ERROR',
    PERMISSION: 'BUSINESS_PERMISSION_ERROR',
    RESOURCE_NOT_FOUND: 'BUSINESS_RESOURCE_NOT_FOUND',
    DUPLICATE: 'BUSINESS_DUPLICATE_ERROR',
  },
} as const;

// 시스템 에러 타입
export type SystemErrorType =
  (typeof ERROR_EVENT_TYPES.SYSTEM)[keyof typeof ERROR_EVENT_TYPES.SYSTEM];
// 비즈니스 에러 타입
export type BusinessErrorType =
  (typeof ERROR_EVENT_TYPES.BUSINESS)[keyof typeof ERROR_EVENT_TYPES.BUSINESS];
// 모든 에러 이벤트 타입
export type ErrorEventType = SystemErrorType | BusinessErrorType;

// 시스템 에러 서브타입
export type SystemErrorSubType = keyof typeof ERROR_EVENT_TYPES.SYSTEM;
// 비즈니스 에러 서브타입
export type BusinessErrorSubType = keyof typeof ERROR_EVENT_TYPES.BUSINESS;

// 기본 에러 상세 정보 인터페이스
export interface ErrorDetail {
  message?: string;
  statusCode?: number;
  url?: string;
  timestamp?: string;
  [key: string]: any;
}

// 에러 이벤트 상세 정보 인터페이스
export interface ErrorEventDetail extends ErrorDetail {
  type: ErrorEventType;
}

// 에러 페이지 타입과 에러 이벤트 타입 간의 매핑 함수를 위한 타입
export type ErrorTypeMapping = {
  [key in ErrorEventType]?: ErrorType;
};

// 기본 매핑 정의 (필요에 따라 수정 가능)
export const DEFAULT_ERROR_TYPE_MAPPING: ErrorTypeMapping = {
  [ERROR_EVENT_TYPES.SYSTEM.SERVER]: 'server-error',
  [ERROR_EVENT_TYPES.SYSTEM.NETWORK]: 'server-error',
  [ERROR_EVENT_TYPES.SYSTEM.TIMEOUT]: 'server-error',
  [ERROR_EVENT_TYPES.SYSTEM.UNKNOWN]: 'server-error',
  [ERROR_EVENT_TYPES.BUSINESS.PERMISSION]: 'unauthorized',
  [ERROR_EVENT_TYPES.BUSINESS.RESOURCE_NOT_FOUND]: 'not-found',
};

// 커스텀 이벤트 타입 확장
declare global {
  interface WindowEventMap {
    appError: CustomEvent<ErrorEventDetail>;
  }
}

// 에러 이벤트 타입을 ErrorPageProps로 변환하는 유틸리티 함수 타입
export type ErrorEventToPropsConverter = (
  eventDetail: ErrorEventDetail,
  mapping?: ErrorTypeMapping,
) => ErrorPageProps;
