import { createContext, FC, useState, useEffect, useContext } from 'react';
import { User, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 앱 시작 시 로컬 스토리지에서 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      // 로컬 스토리지에서 토큰과 사용자 정보 가져오기
      const token = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          // 사용자 정보 파싱
          const userObj = JSON.parse(savedUser);
          setIsLoggedIn(true);
          setUser(userObj);
        } catch (error) {
          console.error('사용자 정보 파싱 오류:', error);
          // 오류 시 로그아웃 처리
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
        }
      }

      // 로딩 상태 종료
      setIsLoading(false);
    };

    checkLoginStatus();
  }, []);

  // 로그인 함수
  const login = (token: string, userData: User): void => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
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
