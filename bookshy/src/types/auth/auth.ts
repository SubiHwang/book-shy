import { User } from '@/types/auth/user';

export interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  kakaoLogin: (code: string) => void;
}
