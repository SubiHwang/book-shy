import { FC } from 'react';
import { HeaderProps } from '@/types/common';
import { ArrowLeft } from 'lucide-react';

const Header: FC<HeaderProps> = ({
  title,
  onBackClick,
  showBackButton = true,
  showNotification = true,
  extraButton = null,
  extraButtonIcon = null,
  onExtraButtonClick,
  className = '',
}) => {
  return (
    <header
      className={`sticky top-0 w-full bg-white shadow-md px-4 py-3 flex items-center justify-between z-50 ${className}`}
    >
      <div className="flex items-center">
        {showBackButton && (
          <button
            onClick={onBackClick}
            className="mr-4 p-1 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-lg font-medium truncate">{title}</h1>
      </div>

      <div className="flex items-center space-x-2">
        {showNotification && (
          <button className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
          </button>
        )}

        {extraButton && extraButtonIcon && (
          <button
            onClick={onExtraButtonClick}
            className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            {extraButtonIcon}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
