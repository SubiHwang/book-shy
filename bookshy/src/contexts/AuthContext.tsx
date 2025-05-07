import { createContext, FC, useContext } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  kakaoLogin: () => {},
});

export const AuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      // const refreshToken = localStorage.getItem('refresh_token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          // 사용자 정보 파싱
          const userObj = JSON.parse(savedUser) as User;
          return userObj;
        } catch (error) {
          console.error('사용자 정보 파싱 오류:', error);
          // 오류 시 로컬 스토리지 정보 삭제
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          return null;
        }
      }
      return null;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // 로그인 뮤테이션
  const { mutate: login } = useMutation({
    mutationFn: async ({ token, userData }: { token: string; userData: User }) => {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    },
    onSuccess: (userData) => {
      // 사용자 정보 캐시 업데이트
      queryClient.setQueryData(['auth-user'], userData);
    },
  });

  // 로그아웃 뮤테이션
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      return null;
    },
    onSuccess: () => {
      // 사용자 정보 캐시 초기화
      queryClient.setQueryData(['auth-user'], null);
    },
  });

  // 카카오 로그인 처리 뮤테이션
  const { mutate: kakaoLogin } = useMutation({
    mutationFn: async (code: string) => {
      // 카카오 인증 코드로 API 호출
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/kakao`, {
        code,
      });
      return response.data;
    },
    onSuccess: (data) => {
      // API 응답에서 토큰과 사용자 정보 추출
      const { token, user: userData } = data;

      // 로그인 함수 호출
      login({ token, userData });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user,
        user: user || null,
        isLoading,
        login: (token: string, user: User) => login({ token, userData: user }), // userData: user로 맞춰줌
        logout,
        kakaoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅
export const useAuth = () => useContext(AuthContext);
