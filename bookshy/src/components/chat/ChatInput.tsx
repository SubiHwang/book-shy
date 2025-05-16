import React, { useState, useRef } from 'react';
import { SendHorizonal, Plus, Minus, Camera, Image, CalendarDays, Phone } from 'lucide-react';

interface Props {
  onSend: (content: string) => void;
  showOptions: boolean;
  onToggleOptions: () => void;
  onScheduleClick: () => void;
}

function ChatInput({ onSend, showOptions, onToggleOptions, onScheduleClick }: Props) {
  const [content, setContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSend(content);
    setContent('');
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log('[📷 업로드됨]', file);
    // TODO: 이미지 업로드 처리
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-light-bg-secondary border-t pb-safe">
      {/* 입력창 */}
      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center gap-2 px-4 pt-2 pb-2 box-border"
      >
        <div
          role="button"
          tabIndex={0}
          onClick={onToggleOptions}
          className="p-2 rounded-full transition shrink-0 select-none touch-manipulation"
        >
          {showOptions ? <Minus size={20} /> : <Plus size={20} />}
        </div>

        <input
          type="text"
          placeholder="메시지 보내기"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full max-w-full px-4 py-2 bg-primary-light text-white placeholder-white rounded-full focus:outline-none box-border"
        />

        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            if (content.trim()) {
              onSend(content);
              setContent('');
            }
          }}
          className="p-2 rounded-full transition shrink-0 select-none touch-manipulation"
        >
          <SendHorizonal size={18} />
        </div>
      </form>

      {/* 확장 기능 옵션 */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          showOptions ? 'h-[25vh]' : 'h-0'
        }`}
      >
        <div className="h-full flex items-center justify-around px-6">
          <OptionButton
            icon={<Camera size={28} strokeWidth={1.5} />}
            label="카메라"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.accept = 'image/*';
                fileInputRef.current.capture = 'environment';
              }
              handleFileSelect();
            }}
          />
          <OptionButton
            icon={<Image size={28} strokeWidth={1.5} />}
            label="앨범"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.accept = 'image/*';
                fileInputRef.current.removeAttribute('capture');
              }
              handleFileSelect();
            }}
          />
          <OptionButton
            icon={<CalendarDays size={28} strokeWidth={1.5} />}
            label="약속"
            onClick={onScheduleClick}
          />
          <OptionButton
            icon={<Phone size={28} strokeWidth={1.5} />}
            label="전화"
            onClick={() => {}}
          />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

function OptionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      className="flex flex-col items-center text-primary hover:opacity-80 transition select-none touch-manipulation"
    >
      <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center mb-2">
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export default ChatInput;
