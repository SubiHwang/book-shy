import { FC } from 'react';

// 일반 탭 버튼 컴포넌트
interface TabButtonProps {
  name: string;
  Icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: FC<TabButtonProps> = ({ name, Icon, isActive, onClick }) => {
  return (
    <button
      className={`flex flex-col items-center justify-center w-full h-full ${
        isActive ? 'text-primary' : 'text-light-text-secondary'
      } py-1`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center mb-1">
        <Icon size={window.innerHeight < 667 ? 20 : 24} strokeWidth={isActive ? 2 : 0.5} />
      </div>
      <p className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>{name}</p>
      {isActive && <div className="bg-primary h-1 w-3 rounded-sm mt-1"></div>}
    </button>
  );
};

export default TabButton;
