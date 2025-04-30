import React, { useState } from 'react';

interface Props {
  onSend: (content: string) => void;
  showOptions: boolean;
  onToggleOptions: () => void;
}

function ChatInput({ onSend, showOptions, onToggleOptions }: Props) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSend(content);
    setContent('');
  };

  return (
    <div className="p-2 bg-light-bg-secondary">
      <form onSubmit={handleSubmit} className="flex items-center">
        <button
          type="button"
          onClick={onToggleOptions}
          className="text-2xl text-light-text-secondary focus:outline-none"
        >
          {showOptions ? '-' : '+'}
        </button>
        <input
          type="text"
          placeholder="메시지 보내기"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 ml-2 px-4 py-2 rounded-full border border-gray-300 outline-none bg-primary-light text-white placeholder-white"
        />
        <button type="submit" className="ml-2 text-2xl text-gray-800 focus:outline-none">
          ➤
        </button>
      </form>

      {/* 추가 옵션 메뉴 */}
      {showOptions && (
        <div className="flex justify-around mt-6">
          <OptionButton icon="📷" label="카메라" />
          <OptionButton icon="🖼️" label="앨범" />
          <OptionButton icon="📅" label="약속" />
          <OptionButton icon="📞" label="전화" />
        </div>
      )}
    </div>
  );
}

function OptionButton({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center text-sm text-gray-600 focus:outline-none"
    >
      <span className="text-2xl">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default ChatInput;
