import React, { useState, useRef } from 'react';
import { SendHorizonal, Plus, Minus, Camera, Image, CalendarDays, Phone } from 'lucide-react';
import { uploadChatImage } from '@/services/chat/chat';
import { toast } from 'react-toastify';

interface Props {
  onSend: (content: string) => void;
  showOptions: boolean;
  onToggleOptions: () => void;
  onScheduleClick: () => void;
  chatRoomId: number;
}

function ChatInput({ onSend, showOptions, onToggleOptions, onScheduleClick, chatRoomId }: Props) {
  const [content, setContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSend(content);
    setContent('');
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadChatImage(chatRoomId, file);
      console.log('✅ 이미지 업로드 성공:', result);
    } catch (error: any) {
      console.error('❌ 이미지 업로드 실패:', error);
      toast.error(error.message || '이미지 업로드에 실패했습니다.');
    } finally {
      // 파일 입력 초기화
      e.target.value = '';
    }
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 w-full bg-light-bg-secondary border-t pb-[env(safe-area-inset-bottom)]">
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
          style={{ WebkitOverflowScrolling: 'touch' }}
          disabled={isUploading}
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
          aria-disabled={isUploading}
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
            disabled={isUploading}
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
            disabled={isUploading}
          />
          <OptionButton
            icon={<CalendarDays size={28} strokeWidth={1.5} />}
            label="약속"
            onClick={onScheduleClick}
            disabled={isUploading}
          />
          <OptionButton
            icon={<Phone size={28} strokeWidth={1.5} />}
            label="전화"
            onClick={() => {}}
            disabled={isUploading}
          />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}

function OptionButton({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={disabled ? undefined : onClick}
      className={`flex flex-col items-center text-primary hover:opacity-80 transition select-none touch-manipulation ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center mb-2">
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export default ChatInput;
