// src/components/mylibrary/LibraryTabs.tsx
import React from 'react';

interface LibraryTabsProps {
  activeTab: 'all' | 'public';
  onTabChange: (tab: 'all' | 'public') => void;
  allCount: number;
  publicCount: number;
}

const LibraryTabs: React.FC<LibraryTabsProps> = ({
  activeTab,
  onTabChange,
  allCount,
  publicCount,
}) => {
  return (
    <div className="w-full flex flex-col mb-4">
      {/* 탭 버튼 영역 */}
      <div className="flex border-b border-light-bg-shade">
        <button
          className={`flex-1 py-2 text-center font-medium text-sm focus:outline-none transition-colors ${
            activeTab === 'all'
              ? 'text-primary-accent border-b-2 border-primary-accent font-semibold'
              : 'text-light-text-muted hover:text-light-text-secondary'
          }`}
          onClick={() => onTabChange('all')}
        >
          내 전체 서재
        </button>
        <button
          className={`flex-1 py-2 text-center font-medium text-sm focus:outline-none transition-colors ${
            activeTab === 'public'
              ? 'text-primary-accent border-b-2 border-primary-accent font-semibold'
              : 'text-light-text-muted hover:text-light-text-secondary'
          }`}
          onClick={() => onTabChange('public')}
        >
          내 공개 서재
        </button>
      </div>

      {/* 책 권수 표시 영역 - 탭에 따라 다른 정보 표시 */}
      <div className="py-2 px-4 text-right text-xs text-light-text-muted">
        {activeTab === 'all' ? (
          <span>전체 서재: {allCount}권</span>
        ) : (
          <span>공개 서재: {publicCount}권</span>
        )}
      </div>
    </div>
  );
};

export default LibraryTabs;
