import Logo from '@/assets/logo/logo.svg';
import kakaoLogin from '@/assets/logo/kakao_login_medium_narrow.png';

const REST_API_KEY = import.meta.env.VITE_KAKAO_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
const KAKAO_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

const Login = () => {
  const text = '로그인';
  const handleKakaoLogin = () => {
    window.location.href = KAKAO_URL;
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#fffdf8] z-50">
      <div className="flex flex-col items-center w-full max-w-xs">
        {/* 로고 */}
        <div className="w-full mb-4 flex justify-center">
          <img src={Logo} alt="북끄북끄 로고" className="w-full max-w-[200px]" />
        </div>
        {/* 앱 이름 */}
        {text && <h1 className="text-2xl font-bold text-[#5e4b39] mt-2">{text}</h1>}
        {/* 간단한 설명 문구 */}
        <p className="text-sm text-[#8a7b70] mt-5">간편하게 소셜 로그인을 진행하고</p>
        <p className="text-sm text-[#8a7b70] ">북끄북끄 서비스를 사용해보세요.</p>

        {/* 로그인 버튼들 */}
        <div className="mt-8 w-full">
          <button
            onClick={handleKakaoLogin}
            className="w-full rounded-lg mb-3 font-medium flex items-center justify-center"
          >
            <img src={kakaoLogin} alt="카카오 로그인" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
