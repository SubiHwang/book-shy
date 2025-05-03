import { authAxiosInstance } from '@/services/axiosInstance';
import type { UserProfile } from '@/types/User/user';

export const fetchUserProfile = async (): Promise<UserProfile> => {
  // const userId = localStorage.getItem('userId'); // 혹은 authContext 등에서 가져오기
  const userId = 1;
  if (!userId) throw new Error('유저 ID가 없습니다.');

  return authAxiosInstance.get('/mypage/profile', {
    headers: {
      'X-User-Id': userId,
    },
  });
};
