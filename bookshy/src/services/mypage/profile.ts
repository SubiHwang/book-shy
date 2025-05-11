import { authAxiosInstance } from '@/services/axiosInstance';
import type { UserProfile } from '@/types/User/user';

// 프로필 조회
export const fetchUserProfile = async (): Promise<UserProfile> => {
  return authAxiosInstance.get('/user/profile');
};

// 프로필 수정
export const updateUserProfile = async (payload: {
  nickname: string;
  gender: 'M' | 'F';
  address: string;
  latitude: number | null;
  longitude: number | null;
}) => {
  return authAxiosInstance.put('/user/profile', payload);
};

// 이미지 업로드
export const uploadProfileImage = async (formData: FormData): Promise<{ imageUrl: string }> => {
  const res = await authAxiosInstance.put('/user/profile/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};
