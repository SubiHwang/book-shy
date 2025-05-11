import { authAxiosInstance } from '@/services/axiosInstance';
import type { UserProfile } from '@/types/User/user';

export const fetchUserProfile = async (): Promise<UserProfile> => {
  return authAxiosInstance.get('/user/profile');
};

export const updateUserProfile = async (payload: {
  nickname: string;
  gender: 'M' | 'F';
  address: string;
  latitude: number | null;
  longitude: number | null;
}) => {
  return authAxiosInstance.put('/user/profile', payload);
};
