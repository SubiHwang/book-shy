import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/chat/chat';
import { ThumbsUp, Smile, Check, HelpCircle } from 'lucide-react';

interface Props {
  message: ChatMessage;
  isMyMessage: boolean;
  onLongPress?: () => void;
  onRightClick?: () => void;
  onSelectEmoji?: (emoji: string | null) => void;
  showEmojiSelector?: boolean;
  selectedEmoji?: string;
}

function ChatMessageItem({
  message,
  isMyMessage,
  onLongPress,
  onRightClick,
  onSelectEmoji,
  showEmojiSelector,
  selectedEmoji,
}: Props) {
  const touchTimer = useRef<NodeJS.Timeout | null>(null);
  const selectorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showEmojiSelector) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        onSelectEmoji?.(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiSelector, onSelectEmoji]);

  const handleTouchStart = () => {
    if (isMyMessage) return;
    touchTimer.current = setTimeout(() => {
      onLongPress?.();
    }, 500);
  };

  const handleTouchEnd = () => {
    if (touchTimer.current) {
      clearTimeout(touchTimer.current);
      touchTimer.current = null;
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (isMyMessage) return;
    e.preventDefault();
    onRightClick?.();
  };

  const emojiList = [
    { icon: <ThumbsUp size={18} />, label: '👍' },
    { icon: <Smile size={18} />, label: '😊' },
    { icon: <Check size={18} />, label: '✅' },
    { icon: <HelpCircle size={18} />, label: '❓' },
  ];

  return (
    <div
      className={`relative flex flex-col px-3 py-1 mb-2 ${isMyMessage ? 'items-end' : 'items-start'}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
    >
      {/* 말풍선 + 시간 */}
      <div className={`flex items-end gap-1 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
        <div
          className={`max-w-[85%] sm:max-w-[70%] px-4 py-2 rounded-2xl text-sm sm:text-base whitespace-pre-wrap break-words ${
            isMyMessage ? 'bg-primary-light text-white' : 'bg-light-bg-secondary text-gray-900'
          }`}
        >
          {message.content}
        </div>
        <div className="flex flex-col gap-[2px] text-right text-[10px] text-light-text-muted pb-[1px]">
          {isMyMessage && !message.read && <span className="text-primary text-[10px]">1</span>}
          <span>{message.sentAt}</span>
        </div>
      </div>

      {/* 이모지 - 말풍선 아래에 따로 */}
      {selectedEmoji && (
        <div
          className={`mt-1 px-3 py-1 rounded-xl bg-white text-gray-800 text-sm flex items-center gap-1 shadow-sm`}
        >
          <span>{selectedEmoji}</span>
          <span className="text-[11px] text-gray-600">1</span>
        </div>
      )}

      {/* 이모지 선택 팝업 */}
      {showEmojiSelector && (
        <div
          ref={selectorRef}
          className="absolute bottom-full mb-1 flex gap-1 bg-white border border-gray-300 rounded-xl shadow-lg p-1 z-30"
        >
          {emojiList.map((emoji) => (
            <button
              key={emoji.label}
              className="p-1 hover:bg-gray-100 rounded-full transition"
              onClick={() => onSelectEmoji?.(emoji.label)}
            >
              {emoji.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatMessageItem;
