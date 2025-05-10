import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

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
  (error: AxiosError) => {
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
