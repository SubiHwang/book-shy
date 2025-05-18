import { authAxiosInstance } from '@/services/axiosInstance';
import type { UserProfile, AddressUpdateRequest } from '@/types/User/user';

// 프로필 조회
export const fetchUserProfile = async (): Promise<UserProfile> => {
  try {
    const res = await authAxiosInstance.get<string, UserProfile>('/user/profile');
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};

// 프로필 수정
export const updateUserProfile = async (payload: {
  nickname: string;
  gender: 'M' | 'F';
  address: string;
  latitude: number | null;
  longitude: number | null;
}): Promise<{ accessToken?: string; refreshToken?: string }> => {
  const res: { accessToken?: string; refreshToken?: string } = await authAxiosInstance.put(
    '/user/profile',
    payload,
  );
  return res;
};

// 프로필 이미지 수정
export const uploadProfileImage = async (formData: FormData): Promise<{ imageUrl: string }> => {
  const res: { imageUrl: string } = await authAxiosInstance.put('/user/profile/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
};

// 주소 업데이트
export const updateUserAddress = async (payload: AddressUpdateRequest): Promise<void> => {
  await authAxiosInstance.put('/user/profile/address', payload);
};
