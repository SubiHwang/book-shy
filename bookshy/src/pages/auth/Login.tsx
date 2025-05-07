import Logo from '@/assets/logo/logo.svg';

const Login = () => {
  const text = '로그인';

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
        <p className="text-sm text-[#8a7b70] mt-2">
          간편하게 로그인을 진행하고 북끄북끄를 사용해보세요.
        </p>

        {/* 로그인 버튼들 */}
        <div className="mt-8 w-full">
          <button className="w-full py-3 bg-[#5e4b39] text-white rounded-lg mb-3 font-medium">
            카카오로 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
