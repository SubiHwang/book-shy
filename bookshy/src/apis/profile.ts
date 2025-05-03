import { authAxiosInstance } from '../services/axiosInstance';

export const fetchUserProfile = async () => {
  const res = await authAxiosInstance.get('/mypage/profile');
  return res.data;
};
