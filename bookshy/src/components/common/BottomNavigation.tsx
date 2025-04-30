// src/components/common/BottomNavigation/index.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // 현재 경로에 따라 활성화된 메뉴 확인
  const isActive = (path: string) => {
    return currentPath.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
      {/* 내 서재 */}
      <Link
        to="/my-library"
        className={`flex flex-col items-center justify-center w-full h-full ${
          isActive('/my-library') ? 'text-red-500' : 'text-gray-500'
        }`}
      >
        <svg
          className="w-6 h-6"
          fill={isActive('/my-library') ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isActive('/my-library') ? 1 : 2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <span className="text-xs mt-1 font-medium">내 서재</span>
      </Link>

      {/* 매칭 추천 */}
      <Link
        to="/recommendations"
        className={`flex flex-col items-center justify-center w-full h-full ${
          isActive('/recommendations') ? 'text-red-500' : 'text-gray-500'
        }`}
      >
        <svg
          className="w-6 h-6"
          fill={isActive('/recommendations') ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isActive('/recommendations') ? 1 : 2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <span className="text-xs mt-1 font-medium">매칭 추천</span>
      </Link>

      {/* 채팅 */}
      <Link
        to="/chat"
        className={`flex flex-col items-center justify-center w-full h-full ${
          isActive('/chat') ? 'text-red-500' : 'text-gray-500'
        }`}
      >
        <svg
          className="w-6 h-6"
          fill={isActive('/chat') ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isActive('/chat') ? 1 : 2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span className="text-xs mt-1 font-medium">채팅</span>
      </Link>

      {/* 독서 기록 */}
      <Link
        to="/reading-logs"
        className={`flex flex-col items-center justify-center w-full h-full ${
          isActive('/reading-logs') ? 'text-red-500' : 'text-gray-500'
        }`}
      >
        <svg
          className="w-6 h-6"
          fill={isActive('/reading-logs') ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isActive('/reading-logs') ? 1 : 2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
        <span className="text-xs mt-1 font-medium">독서 기록</span>
      </Link>

      {/* 마이 */}
      <Link
        to="/profile"
        className={`flex flex-col items-center justify-center w-full h-full ${
          isActive('/profile') ? 'text-red-500' : 'text-gray-500'
        }`}
      >
        <svg
          className="w-6 h-6"
          fill={isActive('/profile') ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isActive('/profile') ? 1 : 2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span className="text-xs mt-1 font-medium">마이</span>
      </Link>
    </nav>
  );
};

export default BottomNavigation;
