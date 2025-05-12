import { FC } from 'react';

interface SystemMessageProps {
  title?: string;
  content: string;
  variant?: 'notice' | 'info' | 'warning';
}

const SystemMessage: FC<SystemMessageProps> = ({ title, content, variant = 'notice' }) => {
  const bgColor = {
    notice: 'bg-[#FFF5F5]', // 연한 핑크
    info: 'bg-[#FEFEE7]', // 연한 노랑
    warning: 'bg-yellow-100',
  }[variant];

  const textColor = {
    notice: 'text-red-500',
    info: 'text-primary',
    warning: 'text-yellow-800',
  }[variant];

  return (
    <div className={`${bgColor} text-sm text-gray-800 rounded-md p-3 leading-relaxed mb-2`}>
      {title && <div className={`${textColor} font-semibold mb-1`}>{title}</div>}
      <p className="whitespace-pre-line">{content}</p>
    </div>
  );
};

export default SystemMessage;
