import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
} from 'axios';

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
authAxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data; // 응답 데이터만 반환
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // headers가 존재하지 않으면 빈 객체로 초기화
    if (!originalRequest.headers) {
      originalRequest.headers = {};
    }

    // 또는 더 안전하게:
    const headers = originalRequest.headers || {};
    originalRequest.headers = headers;

    // 토큰 만료로 인한 401 에러인지 확인
    if (error.response && error.response.status === 500 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // localStorage나 다른 저장소에서 refresh token 가져오기
        const refresh_token = localStorage.getItem('refresh_token');
        const fcmToken = localStorage.getItem('firebase_token');

        if (!refresh_token) {
          // refresh token이 없으면 로그인 페이지로 리다이렉트
          window.location.href = '/login';
          // localStorage.removeItem('auth_token');
          // localStorage.removeItem('refresh_token');
          return Promise.reject(error);
        }

        // 토큰 갱신 요청
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken: refresh_token,
          fcmToken: fcmToken,
        });

        // 새 토큰 저장
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem('auth_token', accessToken);

        // 새 refresh token이 있으면 업데이트
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
        }

        // 새 토큰으로 헤더 업데이트
        authAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        // 원래 요청 재시도
        return authAxiosInstance(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // 401 이외의 에러는 그대로 reject
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
    return Promise.reject(error);
  },
);

export { authAxiosInstance, publicAxiosInstance };
