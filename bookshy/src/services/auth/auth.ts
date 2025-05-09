import { publicAxiosInstance, authAxiosInstance } from '../axiosInstance';

interface KakaoLoginRequest {
  token: string;
  fcmToken: string;
}

interface KakaoLoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const kakaoLogin = async ({
  token,
  fcmToken,
}: KakaoLoginRequest): Promise<KakaoLoginResponse> => {
  try {
    // POST 요청의 형식에 맞게 수정
    const res = await publicAxiosInstance.post<KakaoLoginRequest, KakaoLoginResponse>(
      '/auth/sign-in/kakao',
      {
        token: token,
        fcmToken: fcmToken,
      },
    );

    console.log('카카오 로그인 응답:', res);

    // 응답 데이터 반환
    return res;
  } catch (error) {
    console.error('카카오 로그인 오류:', error);
    throw error;
  }
};

export const logoutfetch = async () => {
  try {
    const res = await authAxiosInstance.post('/auth/sign-out');
    console.log('로그아웃 응답:', res);
    return res;
  } catch (error) {
    console.error('로그아웃 오류:', error);
    throw error;
  }
};
