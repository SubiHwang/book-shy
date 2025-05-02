import { FC } from 'react';
import { HeaderProps } from '@/types/common';
import { ArrowLeft, Bell } from 'lucide-react';

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
            <Bell size={24} />
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
