import { authAxiosInstance } from '@/services/axiosInstance';
import type { UserProfile } from '@/types/User/user';

export const fetchUserProfile = async (): Promise<UserProfile> => {
  return authAxiosInstance.get('/user/profile');
};
