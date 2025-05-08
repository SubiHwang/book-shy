import { User } from '@/types/auth/user';

export interface AuthContextType {
  isLoggedIn: boolean;
  user?: User | null;
  isLoading: boolean;
  login: (params: { token: string; fcmToken: string }) => void;
  logout: () => void;
}
