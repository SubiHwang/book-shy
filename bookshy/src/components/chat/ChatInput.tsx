import React, { useState } from 'react';
import { SendHorizonal, Plus } from 'lucide-react';

interface Props {
  onSend: (content: string) => void;
  showOptions: boolean;
  onToggleOptions: () => void;
  onScheduleClick: () => void;
}

function ChatInput({ onSend, showOptions, onToggleOptions, onScheduleClick }: Props) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSend(content);
    setContent('');
  };

  return (
    <div className="bg-[#FFFCF9] p-3 border-t">
      {/* 입력창 */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleOptions}
          className="p-2 rounded-full text-primary hover:bg-red-100 transition"
        >
          <Plus size={20} />
        </button>

        <input
          type="text"
          placeholder="메시지 보내기"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 px-4 py-2 bg-primary-light text-white placeholder-white rounded-full focus:outline-none"
        />

        <button
          type="submit"
          className="p-2 text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition"
        >
          <SendHorizonal size={18} />
        </button>
      </form>

      {/* 확장 기능 버튼 */}
      {showOptions && (
        <div className="flex justify-around mt-4">
          <OptionButton icon="📷" label="카메라" />
          <OptionButton icon="🖼️" label="앨범" />
          <OptionButton icon="📅" label="약속" onClick={onScheduleClick} />
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
      className="flex flex-col items-center text-primary hover:opacity-80 transition"
    >
      <div className="w-12 h-12 rounded-full border border-primary flex items-center justify-center text-2xl">
        {icon}
      </div>
      <span className="text-sm mt-1">{label}</span>
    </button>
  );
}

export default ChatInput;
