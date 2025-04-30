/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard Variable', 'sans-serif'],
      },
      colors: {
        tabBackground: '#F9FAFB', // 탭 배경 색상
        // 라이트 모드 배경 컬러
        'light-bg': {
          DEFAULT: '#FFFDF8', // 기본 배경
          secondary: '#FFFBF2', // 보조 배경
          card: '#FFFFFF', // 카드/컴포넌트 배경
          shade: '#F5F2E8', // 음영 요소
        },
        // 다크 모드 배경 컬러
        'dark-bg': {
          DEFAULT: '#1E1A14', // 기본 배경
          secondary: '#252018', // 보조 배경 (업데이트됨)
          card: '#2E2922', // 카드/컴포넌트 배경 (업데이트됨)
          shade: '#38332D', // 음영 요소 (업데이트됨)
        },
        // 북끄북끄 포인트 컬러 (차분한 로즈)
        primary: {
          DEFAULT: '#E15F63', // Primary (차분한 로즈)
          light: '#EE8F92', // Primary Light
          dark: '#C04448', // Primary Dark
          accent: '#D57377', // Primary Accent
        },
        // 라이트 모드 텍스트 컬러
        'light-text': {
          DEFAULT: '#2D2D2D', // 기본 텍스트
          secondary: '#5F5F5F', // 보조 텍스트
          muted: '#8A8A8A', // 흐린 텍스트
          inverted: '#FFFFFF', // 반전 텍스트
        },
        // 다크 모드 텍스트 컬러 (업데이트됨)
        'dark-text': {
          DEFAULT: '#F5F0E8', // 기본 텍스트 (업데이트됨)
          secondary: '#C5C0B8', // 보조 텍스트 (업데이트됨)
          muted: '#9E9992', // 흐린 텍스트 (업데이트됨)
          inverted: '#2D2D2D', // 반전 텍스트
        },
        // 상태 표시 컬러 (라이트 모드)
        'light-status': {
          success: '#4CAF50', // 성공
          info: '#2196F3', // 정보
          warning: '#FF9800', // 경고
          error: '#F44336', // 오류
        },
        // 상태 표시 컬러 (다크 모드)
        'dark-status': {
          success: '#66BB6A', // 성공
          info: '#42A5F5', // 정보
          warning: '#FFA726', // 경고
          error: '#EF5350', // 오류
        },
      },
    },
  },
  plugins: [],
};
