import { FC, useState } from 'react';
import { HeaderProps } from '@/types/common';
import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import NotificationButton from './NotificationButton';

const Header: FC<HeaderProps> = ({
  title,
  onBackClick,
  showBackButton = true,
  showNotification = true,
  extraButton = null,
  extraButtonIcon = null,
  onExtraButtonClick,
  className = 'bg-light-bg shadow-md',
}) => {
  const location = useLocation();
  const [hasNotifications, setHasNotifications] = useState<boolean>(false);

  // 숨길 경로 목록
  const hiddenPaths = ['/bookshelf/add/title', '/bookshelf/add/isbn'];

  // 현재 경로가 숨김 목록에 있는지 확인
  const shouldHide = hiddenPaths.some((path) => location.pathname.includes(path));

  // 특정 경로에서는 헤더를 표시하지 않음
  if (shouldHide) {
    return null;
  }
  return (
    <header
      className={`sticky top-0 w-full px-4 py-3 flex items-center justify-between z-50 ${className}`}
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
        {showNotification && <NotificationButton />}

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
