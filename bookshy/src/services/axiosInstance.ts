import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import {
  dispatchSystemError,
  dispatchBusinessError,
  dispatchHttpError,
} from '@/utils/error/errorEventUtils';

// 타입만 import
import type { ErrorDetail } from '@/types/common/error/Error';

const API_BASE_URL = import.meta.env.VITE_BASE_URL as string;
const API_TIMEOUT = 30000;

// member만 접근 가능한 api 사용을 위한 기본 인스턴스 생성
const authAxiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
authAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// 토큰 갱신 관련 변수들
let isRefreshing: boolean = false;
type RefreshCallback = (token: string) => void;
let refreshSubscribers: RefreshCallback[] = [];

// 토큰 갱신 후 대기 중인 요청들에게 새 토큰을 전달하는 함수
const onRefreshed = (token: string): void => {
  refreshSubscribers.forEach((callback: RefreshCallback) => callback(token));
  refreshSubscribers = [];
};

// 토큰 갱신을 기다리는 함수
const addRefreshSubscriber = (callback: RefreshCallback): void => {
  refreshSubscribers.push(callback);
};

// 응답 인터셉터
authAxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // ✅ 성공 상태인지 확인 (200~299)
    if (response.status < 200 || response.status >= 300) {
      const error = response.data.error;
      const statusCode = error.status;
      const errorDetail: ErrorDetail = {
        message: error.message || '오류가 발생 했습니다.',
        statusCode,
        data: response.data,
      };
      dispatchBusinessError(statusCode, errorDetail);
      return Promise.reject(error);
    }
    return response.data;
  },
  async (error: AxiosError) => {
    // originalRequest에 _retry 속성을 추가하기 위한 타입 정의
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest.headers) {
      originalRequest.headers = {};
    }

    // 토큰 만료로 인한 401 에러이고 아직 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refresh_token = localStorage.getItem('refresh_token');
          const fcmToken = localStorage.getItem('firebase_token');

          if (!refresh_token) {
            // 로그아웃 처리
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');

            // 에러 이벤트 발생 - 권한 없음
            dispatchBusinessError('PERMISSION', {
              message: '로그인이 필요합니다.',
              redirectUrl: '/login',
            });

            return Promise.reject(error);
          }

          // 토큰 갱신 요청
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken: refresh_token,
            fcmToken: fcmToken,
          });

          const { accessToken, refreshToken } = response.data;
          if (!accessToken) {
            // 로그아웃 처리
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');

            // 에러 이벤트 발생 - 권한 없음
            dispatchBusinessError('PERMISSION', {
              message: '세션이 만료되었습니다. 다시 로그인해주세요.',
              redirectUrl: '/login',
            });

            return Promise.reject(error);
          }

          localStorage.setItem('auth_token', accessToken);

          if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
          }

          authAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

          // 대기 중인 요청들에게 새 토큰 전달
          onRefreshed(accessToken);

          // 갱신 상태 초기화
          isRefreshing = false;

          // 현재 요청 재시도
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return authAxiosInstance(originalRequest);
        } catch (refreshError) {
          // 토큰 갱신 실패 처리
          isRefreshing = false;
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');

          // 에러 이벤트 발생 - 권한 없음
          dispatchBusinessError('PERMISSION', {
            message: '인증에 실패했습니다. 다시 로그인해주세요.',
            redirectUrl: '/login',
          });

          return Promise.reject(refreshError);
        }
      } else {
        // 이미 토큰 갱신 중인 경우, 새 토큰을 받을 때까지 대기
        return new Promise<any>((resolve) => {
          addRefreshSubscriber((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            resolve(authAxiosInstance(originalRequest));
          });
        });
      }
    }

    // HTTP 에러 처리 (기존 500 에러 처리 대체)
    if (error.response) {
      // 서버 응답이 있는 경우 - HTTP 상태 코드 기반 에러 처리
      const statusCode = error.response.status;
      const errorDetail: ErrorDetail = {
        message: '오류가 발생했습니다.',
        statusCode,
        url: originalRequest.url,
        data: error.response.data,
      };

      // HTTP 상태 코드에 따른 에러 이벤트 발생
      dispatchHttpError(statusCode, errorDetail);
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우 (네트워크 에러)
      dispatchSystemError('NETWORK', {
        message: '서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.',
        url: originalRequest.url,
      });
    } else {
      // 요청 설정 과정에서 에러가 발생한 경우
      dispatchSystemError('UNKNOWN', {
        message: error.message || '알 수 없는 오류가 발생했습니다.',
        error: error.toJSON ? error.toJSON() : error,
      });
    }

    return Promise.reject(error);
  },
);

// 모두 접근 가능한 api 사용을 위한 기본 인스턴스 생성(로그인, 회원가입 등)
const publicAxiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
});

publicAxiosInstance.interceptors.request.use(
  (config) => {
    // 토큰 필요 없음
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

publicAxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status !== 200) {
      const error = response.data.error;
      const statusCode = error.status;
      const errorDetail: ErrorDetail = {
        message: error.message || '오류가 발생 했습니다.',
        statusCode,
        data: response.data,
      };
      dispatchBusinessError(statusCode, errorDetail);
      return Promise.reject(error);
    }
    return response.data;
  },
  (error: AxiosError) => {
    // originalRequest 접근을 위한 타입 캐스팅
    const originalRequest = error.config as AxiosRequestConfig;

    // HTTP 에러 처리 (기존 500 에러 처리 대체)
    if (error.response) {
      // 서버 응답이 있는 경우 - HTTP 상태 코드 기반 에러 처리
      const statusCode = error.response.status;
      const errorDetail: ErrorDetail = {
        message: '오류가 발생했습니다.',
        statusCode,
        url: originalRequest.url,
        data: error.response.data,
      };

      // HTTP 상태 코드에 따른 에러 이벤트 발생
      dispatchHttpError(statusCode, errorDetail);
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우 (네트워크 에러)
      dispatchSystemError('NETWORK', {
        message: '서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.',
        url: originalRequest.url,
      });
    } else {
      // 요청 설정 과정에서 에러가 발생한 경우
      dispatchSystemError('UNKNOWN', {
        message: error.message || '알 수 없는 오류가 발생했습니다.',
        error: error.toJSON ? error.toJSON() : error,
      });
    }

    return Promise.reject(error);
  },
);

export { authAxiosInstance, publicAxiosInstance };
