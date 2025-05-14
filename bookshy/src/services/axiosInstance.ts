import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL as string; // .env 파일에서 가져온 API 기본 URL
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
// 요청 보내기 전 수행할 작업을 정의
authAxiosInstance.interceptors.request.use(
  (config) => {
    // 토큰 추가 로직
    // console.log('baseurl', API_BASE_URL);

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

// 응답 인터셉터
// 응답을 받은 후 수행할 작업을 정의
// 토큰 갱신 중인지 추적하는 변수
let isRefreshing: boolean = false;

// 콜백 함수의 타입 정의
type RefreshCallback = (token: string) => void;

// 토큰 갱신 완료를 기다리는 요청들의 콜백 배열
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
            window.location.href = '/login';
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
            window.location.href = '/login';
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
          window.location.href = '/login';
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

    // 500 에러 확인 
    if (!error.response || error.response.status >= 500) {
      // 서버 에러이면 에러 페이지로 이동
      window.location.href = '/500';
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
    // 토큰 추가 로직
    console.log('baseurl', API_BASE_URL);
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

publicAxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data; // 응답 데이터만 반환
  },
  (error: AxiosError) => {
    // 500 에러 확인 
    if (!error.response || error.response.status >= 500) {
      // 서버 에러이면 에러 페이지로 이동
      window.location.href = '/500';
    }
    return Promise.reject(error);
  },
);

export { authAxiosInstance, publicAxiosInstance };
