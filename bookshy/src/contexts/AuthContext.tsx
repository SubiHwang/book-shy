import { createContext, FC, useContext } from 'react';
import { AuthContextType } from '@/types/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { kakaoLogin, logoutfetch } from '@/services/auth/auth';

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<string | null>({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const accessToken = localStorage.getItem('auth_token');
      const refreshToken = localStorage.getItem('refresh_token');
      // const savedUser = localStorage.getItem('user');

      if (accessToken && refreshToken) {
        try {
          // 사용자 정보 파싱
          // const userObj = JSON.parse(savedUser) as User;
          // return userObj;
          return accessToken;
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
    mutationFn: async ({ token, fcmToken }: { token: string; fcmToken: string }) => {
      try {
        const response = await kakaoLogin({ token, fcmToken });
        const { accessToken, refreshToken } = response;

        localStorage.setItem('auth_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);

        return accessToken;
      } catch (error) {
        console.error('로그인 실패:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        throw error;
      }
    },
    onSuccess: (accessToken) => {
      queryClient.setQueryData(['auth-user'], accessToken);
    },
    onError: (error) => {
      console.error('로그인 뮤테이션 에러:', error);
      queryClient.setQueryData(['auth-user'], null);
    },
  });

  // 로그아웃 뮤테이션
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        await logoutfetch();
        
      } catch (error) {
        console.error('로그아웃 오류:', error);
        throw error;
        
      }
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      return null;
    },
    onSuccess: () => {
      // 사용자 정보 캐시 초기화
      queryClient.setQueryData(['auth-user'], null);
    },
  });

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅
export const useAuth = () => useContext(AuthContext);
