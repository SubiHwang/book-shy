import { FC, useState } from 'react';

interface ChatInputBarProps {
  onToggleOptions: () => void;
  showOptions: boolean;
}

const ChatInputBar: FC<ChatInputBarProps> = ({ onToggleOptions, showOptions }) => {
  const [content, setContent] = useState('');
  return (
    <div
      className="w-full flex items-center gap-2 px-4 py-2 bg-light-bg-secondary border-t"
      style={{ height: 64 }}
    >
      <button onClick={onToggleOptions} className="p-2 text-xl">
        {showOptions ? '-' : '+'}
      </button>
      <input
        className="flex-1 px-4 py-2 rounded-full bg-primary-light text-white placeholder-white focus:outline-none"
        placeholder="메시지 보내기"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <button className="p-2 text-primary font-bold">전송</button>
    </div>
  );
};

export default ChatInputBar; 