import { publicAxiosInstance } from '../axiosInstance';

interface KakaoLoginRequest {
  token: string;
  FCMtoken: string;
}

export const kakaoLogin = async (code: string): Promise<KakaoLoginRequest> => {
  try {
    // POST 요청의 형식에 맞게 수정
    const response = await publicAxiosInstance.post('/auth/sign-in/kakao', {
      token: code,
    });

    // 응답 데이터 반환
    return response.data;
  } catch (error) {
    console.error('카카오 로그인 오류:', error);
    throw error; // 오류 재발생 (호출자에서 처리할 수 있도록)
  }
};
